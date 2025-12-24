# 💜 Katia - Beauty Salon Booking Platform

Современная SaaS платформа для бронирования услуг салонов красоты (аналог Fresha) с фиолетово-розовым градиентным дизайном.

<!-- Раскомментируйте после деплоя и замените YOUR_USERNAME на ваш GitHub username -->
<!-- ![Deploy Status](https://github.com/YOUR_USERNAME/katia-platform/actions/workflows/deploy.yml/badge.svg) -->
<!-- ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-success) -->
<!-- ![License](https://img.shields.io/badge/license-Proprietary-blue) -->

---

## 🚀 Быстрый старт

### ⚡ ONE-CLICK PUSH В GITHUB:

**После изменений в Figma Make, просто:**

**Windows (двойной клик):**
```
push.bat
```

**Или PowerShell:**
```powershell
.\push.ps1
```

**Или npm (универсально):**
```bash
npm run git:deploy
```

📚 **Подробнее:** [AUTO_PUSH_GUIDE.md](./AUTO_PUSH_GUIDE.md) | ⚡ [QUICK_PUSH.md](./QUICK_PUSH.md)

---

### Установка зависимостей:

```bash
npm install
# или
pnpm install
```

### Запуск dev сервера:

```bash
npm run dev
# или
pnpm dev
```

Откройте: **http://localhost:5173**

---

## ✨ Возможности

### ✅ Реализовано:

- 🔐 **Авторизация** - Email/Password + OAuth (Google, Facebook)
- 🏠 **Главная страница** - Hero section с поиском
- 🏪 **Каталог салонов** - Карусели с салонами
- 📱 **Mobile-first** - Адаптивный дизайн
- 💎 **UI компоненты** - shadcn/ui кмпоннты
- 🎨 **Дизайн** - Фиолетово-розовые градиенты
- 🔔 **Уведомления** - Toast notifications (Sonner)
- 👤 **Профиль пользователя** - Dropdown меню в Header

### 🚧 В разработке:

- 📅 Календарь бронирований (Drag & Drop)
- 💳 Платёжная система (Stripe)
- 📊 Аналитика для салонов
- ⭐ Отзывы и рейтинги
- 📸 Галереи работ мастеров

---

## 📁 Структура проекта

```
katia-platform/
├── src/
│   ├── app/
│   │   ├── components/     - React компоненты
│   │   │   ├── ui/        - shadcn/ui компоненты
│   │   │   └── ...
│   │   └── pages/         - Страницы приложения
│   ├── contexts/          - React Contexts (Auth)
│   ├── lib/              - Утилиты и клиенты (Supabase)
│   └── styles/           - CSS стили
├── .env                  - Environment variables (не в git!)
├── .env.example          - Пример .env
└── package.json
```

---

## 🔧 Технологии

- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS 4
- **UI:** shadcn/ui + Radix UI
- **Backend:** Supabase (Auth, Database, Storage)
- **Routing:** React Router 7
- **Forms:** React Hook Form
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React

---

## 🔐 Environment Variables

Файл `.env` уже создан с вашими credentials:

```bash
VITE_SUPABASE_URL=https://bbayqzqlqgqipohulcsd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_FmZxEB3IzAM-KrIbH372xQ_vMx5KJ42
```

**⚠️ Важно:** После изменения `.env` нужно перезапустить dev server!

**⚠️ БЕЗОПАСНОСТЬ:** Файл `.env` содержит секретные ключи и НЕ должен коммититься в git!

### Настройка .env:

1. **Файл `.env` уже создан** со всеми необходимыми переменными
2. **Обновите секретные ключи:**
   ```bash
   # Откройте .env и замените placeholder значения:
   SUPABASE_SERVICE_ROLE_KEY=your_actual_key
   STRIPE_SECRET_KEY=sk_test_your_key
   EMAIL_API_KEY=re_your_key
   ```
3. **Перезапустите сервер:**
   ```bash
   npm run dev
   ```

📖 **Полное руководство:** [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md)

---

## 📚 Документация

- **[START_HERE.md](./START_HERE.md)** - 🚀 Начните отсюда!
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Следующие этапы
- **[SUPABASE_INTEGRATION_GUIDE.md](./SUPABASE_INTEGRATION_GUIDE.md)** - Полное руководство по Supabase

### Environment Variables:
- **[ENV_QUICK_START.md](./ENV_QUICK_START.md)** - ⚡ Быстрая настройка .env
- **[ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md)** - 📖 Полное руководство по переменным окружения
- **[ENV_SETUP_COMPLETE.md](./ENV_SETUP_COMPLETE.md)** - ✅ Что было настроено

### GitHub Pages Deploy:
- **[QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)** - ⚡ Быстрый деплой (3 минуты)
- **[GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md)** - 📖 Полная инструкция по деплою
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - ✅ Чеклист деплоя
- **[COMMAND_CHEATSHEET.md](./COMMAND_CHEATSHEET.md)** - 💻 Команды для копирования

---

## 🎯 Основные маршруты

| Путь | Описание |
|------|----------|
| `/` | Главная страница |
| `/auth` | Авторизация / Регистрация |
| `/salons` | Каталог салонов |
| `/salon/:id` | Профиль салона |
| `/booking/:salonId/:serviceId` | Бронирование услуги |
| `/dashboard` | Личный кабинт клина |
| `/salon-dashboard` | Кабинет владельца салона |
| `/admin` | Админ панель |

---

## 👥 Команда

- **Вы** - Project Lead
- **Dev1** - Backend разработчик
- **Dev2** - Frontend разработчик

---

## 📦 Скрипты

```bash
# Development
npm run dev          # Запуск dev сервера

# Build
npm run build        # Production build

# Preview
npm run preview      # Предпросмотр production build

# Deploy to GitHub Pages
npm run deploy       # Деплой на GitHub Pages (после настройки)
```

---

## 🌐 Деплой на GitHub Pages

### ⚡ Быстрый старт (1 команда!)

**✅ ВСЁ ГОТОВО! package-lock.json создан!**

```bash
git add .github/workflows/deploy.yml package-lock.json && git commit -m "🚀 Deploy Katia Platform" && git push origin main
```

**После push добавьте GitHub Secrets и сайт будет live через 2-3 минуты!**

👉 **[START_DEPLOY.md](./START_DEPLOY.md)** - 🚀 **НАЧНИТЕ ЗДЕСЬ!** Деплой за 3 шага

---

### 🎉 ВСЕ ИСПРАВЛЕНИЯ ГОТОВЫ!

✅ **npm install --legacy-peer-deps** - решает "lock file not in sync"  
✅ **Node.js 20.x** - решает "Unable to find Node version '20'"  
✅ **Environment variables** - добавлены в workflow  
✅ **--legacy-peer-deps** - решает конфликт React 18 vs React 19

👉 **[FINAL_FIX_NPM.md](./FINAL_FIX_NPM.md)** - ⚡ **ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ!** npm install fix

### 🔧 Документация по деплою:

**🔥 Быстрый старт:**
- 🚀 **[START_DEPLOY.md](./START_DEPLOY.md)** - **НАЧНИТЕ ЗДЕСЬ!** Деплой за 3 шага
- ⚡ **[QUICK_FIX_NOW.md](./QUICK_FIX_NOW.md)** - Быстрая инструкция (1 минута)

**📦 Детали исправлений:**
- 📦 **[PACKAGE_LOCK_SOLUTION.md](./PACKAGE_LOCK_SOLUTION.md)** - package-lock.json создан!
- 🔧 **[NODE_VERSION_FIX.md](./NODE_VERSION_FIX.md)** - Node.js версия
- 📋 **[LOCK_FILE_FIX.md](./LOCK_FILE_FIX.md)** - Альтернативные решения

**📚 Полные гайды:**
- ✅ **[ALL_FIXES_APPLIED.md](./ALL_FIXES_APPLIED.md)** - Полный список исправлений
- 📖 **[READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)** - React + Vite деплой
- 🚀 **[GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)** - Полное руководство
- 💻 **[GITHUB_DEPLOY_COMMANDS.md](./GITHUB_DEPLOY_COMMANDS.md)** - Команды для копирования

### 🔑 Требуемые GitHub Secrets:

Добавьте в Settings → Secrets and variables → Actions:

| Secret Name | Где взять | Обязательно |
|-------------|-----------|-------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings | ✅ Да |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → API Keys | ✅ Да |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys | 🔵 Опционально |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Cloud Console | 🔵 Опционально |

**Где получить VITE_SUPABASE_ANON_KEY:**
1. Откройте https://supabase.com/dashboard/project/bbayqzqlqgqipohulcsd/settings/api
2. Скопируйте "anon / public" ключ

---

## 🔥 Фичи

### Для клиентов:
- 🔍 Поиск салонов по городу/услугам
- 📅 Онлайн бронирование
- ⭐ Отзывы и рейтинги
- 💳 Онлайн оплата
- 📱 Push уведомления

### Для владельцев салонов:
- 📊 Ана��итика и отчёты
- 👥 Управление мастерами
- 📅 Календарь записей
- 💰 Управление ценами
- 📈 Статистика продаж

### Для мастеров:
- 📅 Личный календарь
- 💬 Чат с клиентами
- 📸 Портфолио работ
- 💵 Учёт доходов

---

## 🎨 Дизайн-система

### Цвета:
- **Primary:** Purple gradient (#9333ea → #ec4899)
- **Secondary:** Pink
- **Background:** White
- **Text:** Gray-900

### Шрифт:
- **Inter** - весь UI

### Mobile-first:
- Карусели для каталогов
- 85% ширина карточек (видна следующая)
- Swipe жесты

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
→ Перезапустите dev server: `npm run dev`

### "Port 5173 already in use"
→ Vite автоматически выберит другой порт

### OAuth не работает
→ Настройте провайдеров в Supabase Dashboard

### "You are calling ReactDOMClient.createRoot()..." warning
→ ✅ Исправлено! См. [ERROR_FIXES_SUMMARY.md](./ERROR_FIXES_SUMMARY.md)

---

## 📄 Лицензия

Проприетарный прокт - Katia Platform

---

## 🚀 Статус проекта

**Версия:** MVP в разработке  
**Статус:** ✅ Auth готов, 🚧 Booking в процессе

---

**Создано с 💜 командой Katia**