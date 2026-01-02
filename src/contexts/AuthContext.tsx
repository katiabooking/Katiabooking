import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

type RegistrationType = 'client' | 'salon';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: (registrationType?: RegistrationType) => Promise<{ error: AuthError | null }>;
  signInWithFacebook: (registrationType?: RegistrationType) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signInWithFacebook: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Получает URL для OAuth редиректа
 */
const getOAuthRedirectUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  
  if (isLocalhost) {
    // Для локальной разработки (Vite использует порт 5173)
    // window.location.pathname включает /Katiabooking/ если есть base path
    const basePath = window.location.pathname.replace(/\/$/, ''); // убираем trailing slash
    return `${window.location.origin}${basePath}/#/redirect`;
  }
  
  return 'https://katiabooking.github.io/Katiabooking/#/redirect';
};

/**
 * Сохраняет тип регистрации в localStorage перед OAuth
 */
const saveRegistrationType = (type: RegistrationType) => {
  localStorage.setItem('auth_registration_type', type);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем есть ли токен в URL (для HashRouter)
    const handleHashToken = async () => {
      const hash = window.location.hash;
      
      // Ищем access_token в hash (может быть после #/redirect#access_token=...)
      if (hash.includes('access_token=')) {
        // Извлекаем параметры токена
        const tokenPart = hash.split('access_token=')[1];
        if (tokenPart) {
          const params = new URLSearchParams('access_token=' + tokenPart);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken) {
            console.log('Found access token in URL, setting session...');
            
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) {
              console.error('Error setting session:', error);
            } else {
              console.log('Session set successfully:', data.user?.email);
              // Очищаем URL от токена
              const cleanHash = hash.split('#access_token')[0] || '#/';
              window.history.replaceState(null, '', window.location.pathname + cleanHash);
            }
          }
        }
      }
    };

    handleHashToken();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signInWithGoogle = async (registrationType: RegistrationType = 'client') => {
    // Сохраняем тип регистрации перед редиректом
    saveRegistrationType(registrationType);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getOAuthRedirectUrl(),
      },
    });
    return { error };
  };

  const signInWithFacebook = async (registrationType: RegistrationType = 'client') => {
    // Сохраняем тип регистрации перед редиректом
    saveRegistrationType(registrationType);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: getOAuthRedirectUrl(),
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithFacebook,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}