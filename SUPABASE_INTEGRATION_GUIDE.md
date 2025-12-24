# 🚀 Supabase Integration Guide для Katia Platform

## 📋 Что уже готово (Frontend)

✅ **Страница авторизации** (`/src/app/pages/AuthPage.tsx`)
- UI для Google OAuth
- UI для Facebook OAuth
- UI для Email/Password
- Формы Login/Register
- Валидация паролей

✅ **Карусели салонов** (мобильная оптимизация)
- Swipeable на мобильных
- Навигация стрелками на desktop
- Адаптивные размеры карточек

---

## 🎯 ЭТАП 1: Подключение Supabase (Задача для Dev1)

### Шаг 1.1: Создание проекта Supabase

1. Зайти на [supabase.com](https://supabase.com)
2. Создать новый проект "Katia"
3. Сохранить credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Шаг 1.2: Установка пакетов

```bash
npm install @supabase/supabase-js
```

### Шаг 1.3: Создать Supabase клиент

**Файл:** `/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Шаг 1.4: Создать `.env` файл

**Файл:** `/.env`

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **Важно:** Добавить `.env` в `.gitignore`!

---

## 🗄️ ЭТАП 2: Схема базы данных

### 2.1 Таблица: `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'master', 'salon_owner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 2.2 Таблица: `salons`

```sql
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'pro', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'paused', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active salons
CREATE POLICY "Anyone can view salons"
  ON salons FOR SELECT
  USING (subscription_status = 'active');

-- Policy: Owners can manage their salons
CREATE POLICY "Owners can manage own salon"
  ON salons FOR ALL
  USING (auth.uid() = owner_id);
```

### 2.3 Таблица: `services`

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'hair', 'nails', 'massage', 'facial', etc.
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Salon owners can manage services"
  ON services FOR ALL
  USING (
    salon_id IN (
      SELECT id FROM salons WHERE owner_id = auth.uid()
    )
  );
```

### 2.4 Таблица: `masters` (Специалисты)

```sql
CREATE TABLE masters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  specialization TEXT[], -- Array: ['hair', 'nails', ...]
  bio TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE masters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active masters"
  ON masters FOR SELECT
  USING (is_active = true);
```

### 2.5 Таблица: `bookings`

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  master_id UUID REFERENCES masters(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  notes TEXT,
  
  total_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can view their own bookings
CREATE POLICY "Clients can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = client_id);

-- Policy: Salon owners can view their salon's bookings
CREATE POLICY "Salon owners can view salon bookings"
  ON bookings FOR SELECT
  USING (
    salon_id IN (
      SELECT id FROM salons WHERE owner_id = auth.uid()
    )
  );

-- Policy: Clients can create bookings
CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Policy: Clients can cancel their bookings
CREATE POLICY "Clients can cancel own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = client_id AND status = 'pending');
```

### 2.6 Таблица: `reviews`

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  master_id UUID REFERENCES masters(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(booking_id) -- One review per booking
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Clients can create reviews for completed bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    booking_id IN (
      SELECT id FROM bookings 
      WHERE client_id = auth.uid() AND status = 'completed'
    )
  );
```

---

## 🔐 ЭТАП 3: Настройка OAuth (Google & Facebook)

### 3.1 Google OAuth

**В Supabase Dashboard:**
1. Settings → Auth → Providers
2. Enable Google
3. Получить credentials:
   - Google Cloud Console → Create OAuth 2.0 Client
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
4. Вставить `Client ID` и `Client Secret`

### 3.2 Facebook OAuth

**В Supabase Dashboard:**
1. Settings → Auth → Providers
2. Enable Facebook
3. Получить credentials:
   - Facebook Developers → Create App
   - Add Facebook Login product
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Вставить `App ID` и `App Secret`

---

## 💻 ЭТАП 4: Интеграция в AuthPage (Задача для Dev2)

### 4.1 Обновить `/src/app/pages/AuthPage.tsx`

**Добавить импорты:**

```typescript
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
```

**Google Auth:**

```typescript
const handleGoogleAuth = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
  } catch (error: any) {
    console.error('Google auth error:', error.message);
    alert('Failed to sign in with Google');
  } finally {
    setIsLoading(false);
  }
};
```

**Facebook Auth:**

```typescript
const handleFacebookAuth = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
  } catch (error: any) {
    console.error('Facebook auth error:', error.message);
    alert('Failed to sign in with Facebook');
  } finally {
    setIsLoading(false);
  }
};
```

**Email/Password Login:**

```typescript
const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) throw error;
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error: any) {
    console.error('Login error:', error.message);
    alert('Invalid email or password');
  } finally {
    setIsLoading(false);
  }
};
```

**Email/Password Registration:**

```typescript
const handleEmailRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (registerPassword !== registerConfirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  setIsLoading(true);
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          full_name: registerName,
        },
      },
    });
    
    if (authError) throw authError;
    
    // 2. Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: registerEmail,
            full_name: registerName,
            role: 'client',
          },
        ]);
      
      if (profileError) throw profileError;
    }
    
    alert('Registration successful! Please check your email to verify.');
  } catch (error: any) {
    console.error('Registration error:', error.message);
    alert('Registration failed: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🎨 ЭТАП 5: Auth Context (State Management)

### 5.1 Создать Auth Context

**Файл:** `/src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 5.2 Обернуть App в AuthProvider

**Файл:** `/src/app/App.tsx`

```typescript
import { AuthProvider } from '../contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ... rest of app */}
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### 5.3 Использовать в Header

**Файл:** `/src/app/components/Header.tsx`

```typescript
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  
  // ... existing code
  
  return (
    <header>
      {/* ... */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span>Hello, {user.user_metadata.full_name}</span>
            <Button onClick={signOut}>Sign Out</Button>
          </>
        ) : (
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
```

---

## 🛡️ ЭТАП 6: Protected Routes

### 6.1 Создать Protected Route компонент

**Файл:** `/src/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // TODO: Add spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
```

### 6.2 Использовать в App.tsx

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <ClientDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📊 ЭТАП 7: Тестирование

### Чеклист для Dev1:
- [ ] Supabase проект создан
- [ ] Таблицы созданы
- [ ] OAuth providers настроены
- [ ] RLS policies работают

### Чеклист для Dev2:
- [ ] Supabase клиент подключен
- [ ] Google auth работает
- [ ] Facebook auth работает
- [ ] Email login работает
- [ ] Email registration работает
- [ ] AuthContext работает
- [ ] Protected routes работают

---

## 🔄 Следующие шаги

После завершения авторизации:
1. CRUD операции для салонов
2. Система бронирований
3. Календарь с drag & drop
4. CRM функции
5. Аналитика

---

## 📞 Нужна помощь?

Просто скажите мне что не работает, и я помогу!

**Пример:**
- "Ошибка при Google auth"
- "Как добавить роль пользователя?"
- "Нужна функция для создания салона"
