import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Типы сущностей для регистрации
export type EntityType = 'client' | 'salon' | 'master' | 'admin';

// Данные для регистрации
export interface RegistrationData {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  // Дополнительные поля для салона
  salonName?: string;
  salonLocation?: string;
}

// Результат регистрации
export interface RegistrationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

// Состояние хука
interface UseRegistrationState {
  isLoading: boolean;
  error: string | null;
}

// Ключи для localStorage
const REGISTRATION_TYPE_KEY = 'auth_registration_type';
const REGISTRATION_DATA_KEY = 'auth_registration_data';

/**
 * Сохраняет тип регистрации в localStorage
 */
export const saveRegistrationType = (type: EntityType) => {
  localStorage.setItem(REGISTRATION_TYPE_KEY, type);
};

/**
 * Получает и очищает тип регистрации из localStorage
 */
export const getAndClearRegistrationType = (): EntityType => {
  const type = localStorage.getItem(REGISTRATION_TYPE_KEY) as EntityType | null;
  localStorage.removeItem(REGISTRATION_TYPE_KEY);
  return type || 'client';
};

/**
 * Сохраняет дополнительные данные регистрации
 */
export const saveRegistrationData = (data: Partial<RegistrationData>) => {
  localStorage.setItem(REGISTRATION_DATA_KEY, JSON.stringify(data));
};

/**
 * Получает и очищает данные регистрации
 */
export const getAndClearRegistrationData = (): Partial<RegistrationData> | null => {
  const data = localStorage.getItem(REGISTRATION_DATA_KEY);
  localStorage.removeItem(REGISTRATION_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Получает URL для OAuth редиректа
 */
const getOAuthRedirectUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  
  if (isLocalhost) {
    const basePath = window.location.pathname.replace(/\/$/, '');
    return `${window.location.origin}${basePath}/#/redirect`;
  }
  
  return 'https://katiabooking.github.io/Katiabooking/#/redirect';
};

/**
 * Определяет dashboard URL по типу сущности
 */
export const getDashboardByEntityType = (entityType: EntityType): string => {
  switch (entityType) {
    case 'salon':
      return '/owner';
    case 'master':
      return '/master';
    case 'admin':
      return '/admin';
    case 'client':
    default:
      return '/client';
  }
};

/**
 * Определяет страницу регистрации по типу сущности
 */
export const getRegisterPageByEntityType = (entityType: EntityType): string => {
  switch (entityType) {
    case 'salon':
      return '/register';
    case 'client':
    default:
      return '/auth';
  }
};

/**
 * Универсальный хук для регистрации пользователей
 */
export function useRegistration() {
  const [state, setState] = useState<UseRegistrationState>({
    isLoading: false,
    error: null,
  });

  /**
   * Регистрация через Email/Password
   */
  const registerWithEmail = async (
    entityType: EntityType,
    data: RegistrationData
  ): Promise<RegistrationResult> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для последующего редиректа
      saveRegistrationType(entityType);
      
      // Сохраняем дополнительные данные (для салона)
      if (entityType === 'salon' && (data.salonName || data.salonLocation)) {
        saveRegistrationData({
          salonName: data.salonName,
          salonLocation: data.salonLocation,
        });
      }

      // Регистрация в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || '',
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            entity_type: entityType,
            salon_name: data.salonName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User was not created');
      }

      setState({ isLoading: false, error: null });
      
      return {
        success: true,
        userId: authData.user.id,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState({ isLoading: false, error: errorMessage });
      toast.error(`Registration failed: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Регистрация/Вход через Google
   */
  const registerWithGoogle = async (entityType: EntityType): Promise<{ error: AuthError | null }> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для редиректа после OAuth
      saveRegistrationType(entityType);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getOAuthRedirectUrl(),
        },
      });

      if (error) {
        setState({ isLoading: false, error: error.message });
        toast.error(`Google sign in failed: ${error.message}`);
      }

      return { error };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
      setState({ isLoading: false, error: errorMessage });
      return { error: error as AuthError };
    }
  };

  /**
   * Регистрация/Вход через Facebook
   */
  const registerWithFacebook = async (entityType: EntityType): Promise<{ error: AuthError | null }> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для редиректа после OAuth
      saveRegistrationType(entityType);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: getOAuthRedirectUrl(),
        },
      });

      if (error) {
        setState({ isLoading: false, error: error.message });
        toast.error(`Facebook sign in failed: ${error.message}`);
      }

      return { error };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Facebook sign in failed';
      setState({ isLoading: false, error: errorMessage });
      return { error: error as AuthError };
    }
  };

  /**
   * Вход через Email/Password (для существующих пользователей)
   */
  const signInWithEmail = async (
    email: string,
    password: string,
    entityType: EntityType = 'client'
  ): Promise<RegistrationResult> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для редиректа
      saveRegistrationType(entityType);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Проверяем различные варианты сообщения об ошибке подтверждения email
        const errorMessage = error.message?.toLowerCase() || '';
        const isEmailNotConfirmed = 
          errorMessage.includes('email not confirmed') || 
          errorMessage.includes('email_not_confirmed') ||
          errorMessage.includes('email not verified') ||
          error.code === 'email_not_confirmed' ||
          error.status === 403;
        
        if (isEmailNotConfirmed) {
          console.log('🔍 Email not confirmed error detected:', error.message);
          console.log('📧 Checking is_verified status for:', email);
          console.log('🌐 Edge Function URL:', `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/check-verified-and-confirm-email`);
          
          try {
            // Вызываем Edge Function для проверки is_verified
            const functionUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/check-verified-and-confirm-email`;
            console.log('📡 Calling Edge Function:', functionUrl);
            
            const checkResponse = await fetch(functionUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({ email }),
            });

            console.log('📡 Edge Function response status:', checkResponse.status);
            console.log('📡 Edge Function response ok:', checkResponse.ok);
            
            // Если 404, значит функция не развернута
            if (checkResponse.status === 404) {
              console.warn('⚠️ Edge Function not found (404). The function may not be deployed.');
              console.warn('⚠️ Please deploy the Edge Function: supabase functions deploy make-server-3e5c72fb');
              throw new Error('Email not confirmed. Please check your email and click the confirmation link to activate your account. If you have already verified your email in the database, please contact support to confirm your account.');
            }
            
            // Получаем текст ответа для отладки
            const responseText = await checkResponse.text();
            console.log('📡 Edge Function raw response (first 200 chars):', responseText.substring(0, 200));
            
            // Проверяем, что ответ не пустой
            if (!responseText || responseText.trim().length === 0) {
              console.error('❌ Empty response from Edge Function');
              throw new Error('Server returned empty response. Please try again later.');
            }
            
            let checkResult;
            try {
              checkResult = JSON.parse(responseText);
            } catch (parseError) {
              console.error('❌ Failed to parse Edge Function response as JSON:', parseError);
              console.error('❌ Full response text:', responseText);
              
              // Если это HTML страница ошибки, пробуем извлечь информацию
              if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
                throw new Error('Edge Function returned HTML instead of JSON. The function may not be deployed correctly.');
              }
              
              throw new Error('Invalid response from server. Please try again later.');
            }
            
            console.log('📡 Edge Function parsed response:', checkResult);
            
            // Проверяем статус ответа
            if (!checkResponse.ok) {
              console.error('❌ Edge Function returned error status:', checkResponse.status);
              const errorMsg = checkResult.error || `Server error (${checkResponse.status})`;
              throw new Error(errorMsg);
            }

            if (checkResult.success && !checkResult.should_confirm_email) {
              console.log('✅ User is verified, email confirmed. Retrying sign in...');
              
              // Небольшая задержка, чтобы дать время Supabase обновить статус
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Повторяем попытку входа после подтверждения email
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (retryError) {
                console.error('❌ Retry sign in failed:', retryError);
                throw retryError;
              }

              console.log('✅ Sign in successful after email confirmation');
              setState({ isLoading: false, error: null });
              
              return {
                success: true,
                userId: retryData.user?.id,
              };
            } else {
              // Пользователь не верифицирован или нужно подтвердить email
              const errorMsg = checkResult.error || 'Email not confirmed. Please check your email and confirm your account.';
              console.error('❌ User not verified or email confirmation required:', errorMsg);
              throw new Error(errorMsg);
            }
          } catch (checkError: any) {
            console.error('❌ Error checking verification status:', checkError);
            
            // Если это ошибка парсинга или сетевой ошибка, показываем понятное сообщение
            if (checkError.message && (
              checkError.message.includes('JSON') || 
              checkError.message.includes('response') ||
              checkError.message.includes('network') ||
              checkError.message.includes('fetch')
            )) {
              console.warn('⚠️ Edge Function may not be available, falling back to original error');
              // Показываем оригинальную ошибку, но с более понятным сообщением
              throw new Error('Email not confirmed. Please check your email and click the confirmation link to activate your account.');
            }
            
            // Если Edge Function вернула ошибку, показываем её
            if (checkError.message && checkError.message !== error.message) {
              throw checkError;
            }
            
            // Продолжаем с оригинальной ошибкой
            throw error;
          }
        } else {
          // Для других ошибок просто выбрасываем их
          throw error;
        }
      }

      setState({ isLoading: false, error: null });
      
      return {
        success: true,
        userId: data.user?.id,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState({ isLoading: false, error: errorMessage });
      toast.error(`Sign in failed: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Сброс состояния ошибки
   */
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    // Состояние
    isLoading: state.isLoading,
    error: state.error,
    
    // Методы регистрации
    registerWithEmail,
    registerWithGoogle,
    registerWithFacebook,
    signInWithEmail,
    
    // Утилиты
    clearError,
  };
}
