# 🚀 GitHub Pages - Полное руководство по публикации Katia Platform

## 📋 Содержание
1. [Быстрый старт (5 минут)](#-быстрый-старт)
2. [Подробная инструкция](#-подробная-инструкция)
3. [Настройка Environment Variables](#-настройка-environment-variables)
4. [Custom Domain](#-custom-domain-опционально)
5. [Troubleshooting](#-troubleshooting)

---

## ⚡ Быстрый старт

### Шаг 1: Создайте GitHub репозиторий

```bash
# Инициализируйте Git (если еще не сделано)
git init

# Добавьте remote origin
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git

# Добавьте все файлы
git add .

# Первый коммит
git commit -m "🎉 Initial commit - Katia Platform"

# Пуш в main ветку
git push -u origin main
```

**⚠️ ВАЖНО:** Замените `YOUR_USERNAME/katia-platform` на ваш GitHub username и название репозитория!

---

### Шаг 2: Настройте GitHub Pages

1. **Перейдите в Settings вашего репозитория:**
   - `https://github.com/YOUR_USERNAME/katia-platform/settings/pages`

2. **В секции "Build and deployment":**
   - **Source:** Выберите `GitHub Actions` (вместо Deploy from a branch)
   
   ![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/select-github-actions.webp)

3. **Готово!** GitHub Actions настроен автоматически через файл `.github/workflows/deploy.yml`

---

### Шаг 3: Добавьте Environment Variables (Secrets)

**⚠️ КРИТИЧНО:** Без этого шага сайт не заработает!

1. **Перейдите в Settings → Secrets and variables → Actions:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/secrets/actions
   ```

2. **Нажмите "New repository secret" и добавьте:**

#### 🔑 ОБЯЗАТЕЛЬНЫЕ секреты:

| Name | Value | Где взять |
|------|-------|-----------|
| `VITE_SUPABASE_URL` | `https://bbayqzqlqgqipohulcsd.supabase.co` | Ваш Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Project API Keys → anon/public |

#### 💳 Опционально (если используете Stripe):

| Name | Value | Где взять |
|------|-------|-----------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe Dashboard → Developers → API Keys |

#### 🗺️ Опционально (если используете Google Maps):

| Name | Value | Где взять |
|------|-------|-----------|
| `VITE_GOOGLE_MAPS_API_KEY` | `AIza...` | Google Cloud Console → APIs & Services |

**Как добавить секрет:**
1. Нажмите **"New repository secret"**
2. **Name:** `VITE_SUPABASE_URL`
3. **Secret:** Вставьте значение
4. Нажмите **"Add secret"**
5. Повторите для всех секретов

---

### Шаг 4: Обновите vite.config.ts

Откройте файл `/vite.config.ts` и обновите `base`:

```typescript
export default defineConfig({
  // Если используете custom domain (example.com):
  base: '/',
  
  // Если используете GitHub Pages без custom domain:
  // base: '/katia-platform/',  // ⚠️ ЗАМЕНИТЕ на название ВАШЕГО репозитория!
  
  // ... остальная конфигурация
})
```

**Правила для `base`:**
- ✅ Custom domain (`katia.com`): `base: '/'`
- ✅ GitHub Pages (`username.github.io/katia-platform`): `base: '/katia-platform/'`
- ⚠️ Название должно совпадать с именем репозитория!
- ⚠️ Обязательно слеши в начале и конце: `'/repo-name/'`

---

### Шаг 5: Запушьте изменения

```bash
# Добавьте все изменения
git add .

# Коммит
git commit -m "🚀 Setup GitHub Pages deployment"

# Пуш в main
git push origin main
```

---

### Шаг 6: Проверьте деплой

1. **Перейдите в Actions вашего репозитория:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/actions
   ```

2. **Найдите workflow "🚀 Deploy to GitHub Pages":**
   - ✅ Зеленая галочка = успешный деплой
   - ❌ Красный крестик = ошибка (см. [Troubleshooting](#-troubleshooting))

3. **Ваш сайт будет доступен через 1-2 минуты:**
   ```
   https://YOUR_USERNAME.github.io/katia-platform/
   ```

---

## 🔍 Подробная инструкция

### Как работает GitHub Pages деплой?

1. **Вы пушите код** в `main` или `master` ветку
2. **GitHub Actions автоматически:**
   - Устанавливает зависимости (`npm ci`)
   - Собирает production build (`npm run build`)
   - Деплоит папку `dist/` на GitHub Pages
3. **Сайт обновляется** через 1-2 минуты

### Файлы для деплоя:

```
katia-platform/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions workflow
├── .gitignore                  ← Защита .env и секретов
├── vite.config.ts             ← Конфигурация base path
├── package.json               ← Build скрипты
└── .env.example               ← Пример environment variables
```

---

## 🔐 Настройка Environment Variables

### Какие переменные нужны?

#### Frontend (добавляются как GitHub Secrets):

```bash
# Supabase (ОБЯЗАТЕЛЬНО)
VITE_SUPABASE_URL=https://bbayqzqlqgqipohulcsd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Stripe (опционально)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps (опционально)
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

#### Backend (НЕ добавляются в GitHub Secrets, используются на сервере):

```bash
# ⚠️ НИКОГДА НЕ ПУБЛИКУЙТЕ ЭТИ КЛЮЧИ!
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
EMAIL_API_KEY=re_...
```

**Backend переменные должны быть на вашем сервере (Supabase Edge Functions, Vercel, etc.)**

---

### Как проверить что секреты добавлены?

1. **Перейдите:** `Settings → Secrets and variables → Actions`
2. **Вы должны видеть:**
   - `VITE_SUPABASE_URL` ✅
   - `VITE_SUPABASE_ANON_KEY` ✅
   - `VITE_STRIPE_PUBLISHABLE_KEY` ✅ (опционально)

**⚠️ Значения секретов скрыты (GitHub никому не покажет их)**

---

## 🌐 Custom Domain (опционально)

### Хотите использовать свой домен (katia.com)?

#### Шаг 1: Настройте DNS записи

У вашего регистратора домена (Namecheap, GoDaddy, etc.) добавьте:

**Вариант A - Apex domain (katia.com):**
```
Type: A
Name: @
Value: 185.199.108.153
```
```
Type: A
Name: @
Value: 185.199.109.153
```
```
Type: A
Name: @
Value: 185.199.110.153
```
```
Type: A
Name: @
Value: 185.199.111.153
```

**Вариант B - Subdomain (www.katia.com или app.katia.com):**
```
Type: CNAME
Name: www (или app)
Value: YOUR_USERNAME.github.io
```

#### Шаг 2: Настройте GitHub Pages

1. **Settings → Pages → Custom domain**
2. Введите: `katia.com` или `www.katia.com`
3. Нажмите **Save**
4. ✅ Включите **"Enforce HTTPS"** (после проверки DNS)

#### Шаг 3: Обновите vite.config.ts

```typescript
export default defineConfig({
  base: '/',  // Для custom domain всегда '/'
  // ...
})
```

#### Шаг 4: Пуш изменений

```bash
git add .
git commit -m "🌐 Setup custom domain"
git push origin main
```

**⏱️ DNS изменения могут занять до 24 часов**

---

## 🔧 Troubleshooting

### ❌ Build Failed: "Environment variables not found"

**Проблема:** GitHub Actions не видит environment variables

**Решение:**
1. Проверьте что добавили секреты: `Settings → Secrets and variables → Actions`
2. Имена должны быть ТОЧНЫМИ: `VITE_SUPABASE_URL` (не `SUPABASE_URL`)
3. После добавления секретов, заново запустите workflow:
   - `Actions → Failed workflow → Re-run all jobs`

---

### ❌ Page not found (404) после деплоя

**Проблема:** Неправильный `base` path в `vite.config.ts`

**Решение:**

```typescript
// ❌ НЕПРАВИЛЬНО:
base: '/'                    // Для GitHub Pages БЕЗ custom domain
base: '/wrong-repo-name/'   // Неправильное название

// ✅ ПРАВИЛЬНО:
base: '/katia-platform/'    // Название должно совпадать с репозиторием!

// Или для custom domain:
base: '/'
```

После исправления:
```bash
git add vite.config.ts
git commit -m "🔧 Fix base path"
git push origin main
```

---

### ❌ White screen / Blank page

**Проблема:** Ошибки в консоли браузера

**Решение:**
1. Откройте DevTools (F12)
2. Посмотрите Console → есть ли ошибки?
3. Частые причины:
   - ❌ Неправильный `base` path
   - ❌ Missing environment variables
   - ❌ Ошибки в коде (проверьте локально: `npm run build && npm run preview`)

**Тест локально:**
```bash
# Build production
npm run build

# Preview production build
npm run preview
```

Если работает локально, но не работает на GitHub Pages → проверьте `base` path!

---

### ❌ Assets not loading (CSS, JS, images)

**Проблема:** Неправильные пути к assets

**Решение:**

1. **Проверьте `base` в vite.config.ts**
2. **Используйте относительные пути в коде:**

```tsx
// ❌ НЕПРАВИЛЬНО:
<img src="/logo.png" />

// ✅ ПРАВИЛЬНО:
<img src={import.meta.env.BASE_URL + 'logo.png'} />

// Или лучше:
<img src={new URL('../assets/logo.png', import.meta.url).href} />
```

---

### ❌ Supabase connection fails

**Проблема:** "Failed to fetch" или "Network error"

**Решение:**
1. **Проверьте что секреты добавлены в GitHub:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Проверьте Supabase CORS настройки:**
   - Supabase Dashboard → Settings → API
   - Добавьте ваш GitHub Pages URL: `https://username.github.io`

3. **Проверьте что используете правильные ключи:**
   - `anon/public` key (не `service_role`!)

---

### ❌ "No index.html found"

**Проблема:** Vite не находит index.html

**Решение:**
```bash
# Убедитесь что index.html в корне проекта:
ls index.html

# Проверьте vite.config.ts:
build: {
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),
    }
  }
}
```

---

### ❌ GitHub Actions stuck on "Waiting"

**Проблема:** Workflow не запускается

**Решение:**
1. **Проверьте что GitHub Actions включен:**
   - `Settings → Actions → General → Allow all actions`

2. **Проверьте permissions:**
   - `Settings → Actions → General → Workflow permissions`
   - ✅ Включите "Read and write permissions"

3. **Проверьте billing (для приватных репозиториев):**
   - GitHub Actions бесплатен для публичных репозиториев
   - Для приватных нужен billing plan

---

## 📊 GitHub Actions Workflow Explained

### Что делает `.github/workflows/deploy.yml`?

```yaml
name: 🚀 Deploy to GitHub Pages

# Когда запускается:
on:
  push:
    branches: [main, master]  # При пуше в main/master
  workflow_dispatch:          # Или вручную

# Build job:
jobs:
  build:
    steps:
      - Checkout code            # Скачать код
      - Setup Node.js            # Установить Node
      - Install dependencies     # npm ci
      - Build project            # npm run build (с environment variables!)
      - Upload artifact          # Загрузить dist/ для деплоя

  # Deploy job:
  deploy:
    steps:
      - Deploy to GitHub Pages   # Опубликовать на GitHub Pages
```

---

## 🎯 Чеклист перед первым деплоем

- [ ] ✅ `.gitignore` создан и `.env` НЕ коммитится
- [ ] ✅ GitHub репозиторий создан
- [ ] ✅ `vite.config.ts` → `base` настроен правильно
- [ ] ✅ GitHub Secrets добавлены (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] ✅ GitHub Pages source = `GitHub Actions`
- [ ] ✅ Код запушен в `main` ветку
- [ ] ✅ GitHub Actions workflow запустился
- [ ] ✅ Build успешен (зеленая галочка)
- [ ] ✅ Сайт открывается по URL

---

## 🚀 Обновление сайта

После первого деплоя, обновлять сайт очень просто:

```bash
# 1. Внесите изменения в код
# 2. Коммит и пуш:
git add .
git commit -m "✨ Add new feature"
git push origin main

# 3. GitHub Actions автоматически задеплоит обновления!
# 4. Проверьте через 1-2 минуты: https://username.github.io/katia-platform/
```

**🔄 Автоматический деплой при каждом пуше в main!**

---

## 💡 Pro Tips

### 1. Preview в PR (Pull Requests)

Добавьте preview для каждого PR:

```yaml
# .github/workflows/preview.yml
name: 🔍 Preview PR
on: pull_request

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - name: Deploy to Netlify (preview)
        # Используйте Netlify/Vercel для PR previews
```

### 2. Проверка перед деплоем

Добавьте тесты:

```yaml
jobs:
  build:
    steps:
      # ... existing steps
      - name: Run tests
        run: npm test
      - name: Lint code
        run: npm run lint
```

### 3. Кеширование для ускорения

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ← Кеширует node_modules
```

---

## 📚 Дополнительные ресурсы

- 📖 [GitHub Pages Official Docs](https://docs.github.com/en/pages)
- 📖 [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- 📖 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 📖 [Supabase CORS Guide](https://supabase.com/docs/guides/api#cors)

---

## 🆘 Нужна помощь?

1. **Проверьте [Troubleshooting](#-troubleshooting)**
2. **Проверьте GitHub Actions logs:**
   - `Actions → Failed workflow → Build → Expand failed step`
3. **Проверьте браузерную консоль (F12)**
4. **Создайте issue в репозитории**

---

## ✅ Готово!

**Ваш Katia Platform теперь опубликован на GitHub Pages! 🎉**

```
🌐 Live URL: https://YOUR_USERNAME.github.io/katia-platform/
📊 Actions: https://github.com/YOUR_USERNAME/katia-platform/actions
⚙️ Settings: https://github.com/YOUR_USERNAME/katia-platform/settings/pages
```

**Следующие шаги:**
- [ ] Настроить custom domain (опционально)
- [ ] Добавить Google Analytics
- [ ] Настроить SEO meta tags
- [ ] Добавить robots.txt и sitemap.xml

---

**Создано с 💜 для Katia Platform**
