# 💜 Katia - Салон красоты SaaS платформа

[![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Современная платформа для управления салонами красоты с поддержкой нескольких типов пользователей, системой бронирования, CRM и аналитикой.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run dev

# Запуск тестов
npm test

# Запуск тестов с UI
npm run test:ui

# Проверка coverage
npm run test:coverage

# Линтинг
npm run lint

# Форматирование
npm run format

# CI проверка (lint + format + tests)
npm run ci

# Билд для production
npm run build

# Deploy на GitHub Pages
npm run deploy
```

## 🏗️ Архитектура

### Frontend
- **React 18.3.1** + **TypeScript**
- **Vite 6.3.5** (быстрая сборка)
- **Tailwind CSS 4.1.12** (фиолетово-розовые градиенты)
- **Radix UI** (доступные компоненты)
- **Motion** (анимации)
- **React Router 7.11.0** (навигация)

### Backend
- **Supabase** (база данных, auth, storage)
- **Stripe** (платежи, подписки)
- **Edge Functions** (serverless API)

### Testing & CI/CD
- **Vitest** (unit тесты)
- **Testing Library** (React тесты)
- **ESLint + Prettier** (code quality)
- **GitHub Actions** (CI/CD pipelines)

## 🧪 Тестирование

### Тесты авторизации

Полное покрытие тестами для `AuthContext`:

```bash
# Запустить только auth тесты
npx vitest run src/test/contexts/AuthContext.test.tsx

# Все тесты с coverage
npm run test:coverage
```

**Покрытие:**
- ✅ Initial state и loading
- ✅ Session загрузка
- ✅ Email login (успех/ошибки)
- ✅ Email signup (успех/ошибки)
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Sign out
- ✅ Auth state changes
- ✅ Cleanup при unmount

### Coverage требования

```json
{
  "lines": 80,
  "functions": 80,
  "branches": 80,
  "statements": 80
}
```

## 📦 Scripts

| Command | Описание |
|---------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Production build |
| `npm run preview` | Превью production build |
| `npm run deploy` | Deploy на GitHub Pages |
| `npm test` | Запуск тестов (watch mode) |
| `npm run test:ui` | Тесты с UI |
| `npm run test:coverage` | Coverage report |
| `npm run lint` | ESLint проверка |
| `npm run lint:fix` | ESLint fix |
| `npm run format` | Prettier форматирование |
| `npm run format:check` | Prettier проверка |
| `npm run ci` | Полная CI проверка |

## 🔄 CI/CD Pipelines

### Main Pipeline (`.github/workflows/ci.yml`)

Запускается при push в `main` или `develop`:

1. **Lint** - ESLint + Prettier
2. **Test** - Vitest с coverage
3. **Build** - Production build
4. **Deploy** - GitHub Pages (только main)

### PR Checks (`.github/workflows/pr-checks.yml`)

При создании PR:

1. Code quality проверки
2. Auth тесты
3. Coverage отчет в комментариях

### Deploy Preview (`.github/workflows/deploy-preview.yml`)

Preview build для каждого PR

## 🔐 Environment Variables

Создайте `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**GitHub Secrets:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GITHUB_TOKEN` (автоматически)

## 👥 Типы пользователей

- **Owner** - Владелец салона
- **Admin** - Администратор
- **Master** - Мастер
- **Client** - Клиент

## 💰 Подписки

- **Starter** - AED 99/мес
- **Professional** - AED 299/мес
- **Business** - AED 499/мес

## 🎯 Основные фичи

- ✅ Мультиязычность (EN/RU/AR)
- ✅ Конвертация валют (AED/USD/EUR/RUB)
- ✅ Система бронирования
- ✅ CRM и аналитика
- ✅ Подарочные сертификаты
- ✅ Депозиты через Stripe Connect
- ✅ Email рассылки
- ✅ Quick Retail Checkout
- ✅ Система избранного
- ✅ Шаринг салонов

## 📊 Структура проекта

```
katia/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── docs/
│   └── TROUBLESHOOTING.md  # Решения проблем
├── src/
│   ├── app/
│   │   ├── components/     # React компоненты
│   │   └── App.tsx         # Main app
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities
│   ├── styles/             # CSS
│   ├── utils/              # Helper functions
│   └── test/               # Тесты
│       ├── setup.ts        # Test setup
│       └── contexts/       # Context тесты
├── supabase/
│   └── functions/          # Edge functions
├── .eslintrc.js            # ESLint config
├── .prettierrc             # Prettier config
├── vitest.config.ts        # Vitest config
└── package.json
```

## 🐛 Troubleshooting

Столкнулись с проблемой? Проверьте [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md):

- **React Warnings** - createRoot, StrictMode issues
- **Build Issues** - TypeScript errors, bundle size
- **Testing Issues** - Coverage, mocks
- **Deployment Issues** - GitHub Pages, env variables

**Quick Fixes:** [QUICKFIX.md](/QUICKFIX.md) - решения за 30 секунд

**React createRoot Warning:** [Подробное объяснение](/docs/REACT_ROOT_WARNING.md)

## 🤝 Contributing

1. Создайте feature branch
2. Напишите тесты
3. Убедитесь что `npm run ci` проходит
4. Создайте PR

## 📝 License

MIT © Katia Team

---

**Made with 💜 by Katia Team**