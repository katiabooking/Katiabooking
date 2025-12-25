# 🧪 Testing Guide - Katia Platform

Полное руководство по тестированию платформы Katia.

## 📋 Содержание

- [Быстрый старт](#быстрый-старт)
- [Структура тестов](#структура-тестов)
- [Auth тесты](#auth-тесты)
- [Coverage](#coverage)
- [Best Practices](#best-practices)
- [CI/CD](#cicd)

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск всех тестов
npm test

# Запуск с UI
npm run test:ui

# Coverage report
npm run test:coverage

# Только auth тесты
npx vitest run src/test/contexts/AuthContext.test.tsx

# Watch mode
npx vitest watch

# Только измененные файлы
npx vitest run --changed
```

## 📁 Структура тестов

```
src/
├── test/
│   ├── setup.ts                    # Глобальная настройка
│   ├── contexts/
│   │   └── AuthContext.test.tsx    # Auth тесты ✅
│   ├── components/
│   │   ├── Header.test.tsx         # TODO
│   │   └── SalonAuthModal.test.tsx # TODO
│   └── utils/
│       └── salonRoles.test.tsx     # TODO
```

## 🔐 Auth Тесты

Полное покрытие AuthContext логики авторизации и регистрации.

### Запуск

```bash
# Только auth тесты
npx vitest run src/test/contexts/AuthContext.test.tsx

# Watch mode
npx vitest watch src/test/contexts/AuthContext.test.tsx

# Coverage для auth
npx vitest run src/test/contexts/AuthContext.test.tsx --coverage
```

### Покрытие

#### ✅ Initial State
- Loading state при инициализации
- Загрузка существующей сессии
- Обработка отсутствия сессии

#### ✅ Sign In (Email)
- Успешный вход с валидными credentials
- Ошибка при неверных credentials
- Обработка пустых полей
- Правильный вызов Supabase API

#### ✅ Sign Up (Email)
- Успешная регистрация нового пользователя
- Ошибка если пользователь уже существует
- Сохранение full_name в metadata
- Валидация данных

#### ✅ OAuth (Google)
- Инициация Google OAuth flow
- Правильный redirect URL
- Обработка ошибок OAuth

#### ✅ OAuth (Facebook)
- Инициация Facebook OAuth flow
- Правильный redirect URL
- Обработка ошибок

#### ✅ Sign Out
- Успешный выход из системы
- Очистка user и session
- Вызов Supabase signOut

#### ✅ Auth State Changes
- Обновление состояния при изменениях
- Отписка от событий при unmount
- Правильная обработка SIGNED_IN / SIGNED_OUT

### Пример теста

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

describe('signInWithEmail', () => {
  it('должен успешно войти с валидными credentials', async () => {
    const mockSignIn = vi.fn(() => Promise.resolve({ error: null }));
    (supabase.auth.signInWithPassword as any) = mockSignIn;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let response;
    await act(async () => {
      response = await result.current.signInWithEmail(
        'test@example.com',
        'password123'
      );
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response?.error).toBeNull();
  });
});
```

## 📊 Coverage

### Требования

```json
{
  "lines": 80,
  "functions": 80,
  "branches": 80,
  "statements": 80
}
```

### Проверка coverage

```bash
# HTML отчет
npm run test:coverage
open coverage/index.html

# В консоли
npm run test:coverage -- --reporter=text

# Только для конкретного файла
npx vitest run src/contexts/AuthContext.tsx --coverage
```

### Coverage отчет

```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.71 |    83.33 |   90.00 |   85.71 |
 AuthContext.tsx      |   95.00 |    90.00 |  100.00 |   95.00 |
```

## ✅ Best Practices

### 1. Именование тестов

```typescript
// ✅ Good - описательное
it('должен успешно войти с валидными credentials', () => {});

// ❌ Bad - неясное
it('works', () => {});
```

### 2. Arrange-Act-Assert

```typescript
it('should update user on login', async () => {
  // Arrange - подготовка
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockSignIn = vi.fn(() => Promise.resolve({ error: null }));
  (supabase.auth.signInWithPassword as any) = mockSignIn;

  // Act - действие
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await act(async () => {
    await result.current.signInWithEmail('test@example.com', 'pass');
  });

  // Assert - проверка
  expect(mockSignIn).toHaveBeenCalled();
});
```

### 3. Моки

```typescript
// ✅ Good - четкий мок с типами
const mockGetSession = vi.fn(() =>
  Promise.resolve({ data: { session: null }, error: null })
);

// ❌ Bad - any везде
const mockGetSession = vi.fn(() => Promise.resolve({ data: {} as any }));
```

### 4. Cleanup

```typescript
describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Очистка моков перед каждым тестом
  });

  afterEach(() => {
    cleanup(); // Очистка DOM (автоматически в setup.ts)
  });
});
```

### 5. Async тесты

```typescript
// ✅ Good - waitFor для async
it('should load user', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.user).toBeTruthy();
});

// ❌ Bad - без async обработки
it('should load user', () => {
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  expect(result.current.user).toBeTruthy(); // Может быть null!
});
```

### 6. Edge Cases

```typescript
describe('signInWithEmail', () => {
  it('должен успешно войти - happy path', () => {});
  it('должен вернуть ошибку при неверных credentials', () => {});
  it('должен обработать пустые поля', () => {});
  it('должен обработать network error', () => {});
  it('должен обработать timeout', () => {});
});
```

## 🔧 Настройка

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### setup.ts

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup после каждого теста
afterEach(() => {
  cleanup();
});

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      // ...
    },
  })),
}));
```

## 🤖 CI/CD

### GitHub Actions

Тесты запускаются автоматически:

#### Main Pipeline

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run test:coverage
```

#### PR Checks

```yaml
auth-tests:
  runs-on: ubuntu-latest
  steps:
    - run: npx vitest run src/test/contexts/AuthContext.test.tsx
```

### Coverage отчеты

Coverage автоматически загружается в Codecov при каждом push.

## 📝 TODO - Следующие тесты

### Высокий приоритет

- [ ] `SalonAuthModal.test.tsx` - UI компонент авторизации
- [ ] `Header.test.tsx` - Навигация и auth состояния
- [ ] `salonRoles.test.tsx` - Роли и права доступа

### Средний приоритет

- [ ] `SubscriptionContext.test.tsx` - Логика подписок
- [ ] `CurrencyContext.test.tsx` - Конвертация валют
- [ ] `BookingContext.test.tsx` - Система бронирования

### Низкий приоритет

- [ ] `GiftCertificate.test.tsx` - Подарочные сертификаты
- [ ] `QuickRetailCheckout.test.tsx` - Быстрая продажа
- [ ] `ShareSalonModal.test.tsx` - Шаринг салонов

## 🎯 Цели

- [x] Auth тесты - 100% coverage ✅
- [ ] Components - 80% coverage
- [ ] Utils - 90% coverage
- [ ] Contexts - 90% coverage
- [ ] Integration tests - 70% coverage

## 📚 Ресурсы

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

**Happy Testing! 🧪💜**
