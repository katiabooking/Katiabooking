# ✅ Katia Platform - Готов к деплою на GitHub Pages!

## 🎯 Специфика вашего проекта

**Стек:** React 18 + Vite + TypeScript  
**Build папка:** `dist/` (Vite создает после `npm run build`)  
**Тип:** SPA (Single Page Application)  
**Роутинг:** React Router 7

---

## 📦 Все файлы созданы и настроены!

### ✅ Что уже готово:

1. **`.gitignore`** ✅
   - Защищает `.env` от попадания в Git
   - Исключает `node_modules`, `dist`, логи
   - Правильно настроен для React + Vite

2. **`.github/workflows/deploy.yml`** ✅
   - Автоматический деплой при push в main
   - Использует Node.js 20
   - Кеширует npm для ускорения
   - Деплоит из папки `dist/`
   - Поддержка environment variables через GitHub Secrets

3. **`.env.example`** ✅
   - Документирует все переменные
   - Разделяет Frontend (VITE_*) и Backend
   - Инструкции где взять каждый ключ

4. **`vite.config.ts`** ✅
   - `base: './'` - универсальная настройка
   - Правильно настроен `publicDir` и `build`
   - Копирует все файлы из `public/`

5. **`public/404.html`** ✅
   - Уже существует
   - SPA redirect для корректного роутинга

6. **`index.html`** ✅
   - SPA redirect script готов
   - Все meta tags на месте

---

## 🚀 Пошаговая инструкция деплоя (5 минут)

### Шаг 1: Создайте GitHub репозиторий

1. Перейдите: https://github.com/new
2. **Repository name:** `katia-platform` (или любое другое)
3. **Visibility:** **Public** (для бесплатного GitHub Pages)
4. **НЕ добавляйте:** README, .gitignore, license (уже есть)
5. Нажмите **"Create repository"**

---

### Шаг 2: Инициализация Git и первый push

```bash
# Инициализируйте Git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Первый коммит
git commit -m "🎉 Initial commit - Katia Platform ready for deployment"

# Добавьте remote (ЗАМЕНИТЕ YOUR_USERNAME и repo-name!)
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git

# Создайте main ветку и запушьте
git branch -M main
git push -u origin main
```

**⚠️ ВАЖНО:** Замените `YOUR_USERNAME` на ваш GitHub username!

---

### Шаг 3: Настройте GitHub Pages

1. Откройте Settings вашего репо:
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/pages
   ```

2. **Build and deployment:**
   - **Source:** Выберите **"GitHub Actions"**
   - НЕ "Deploy from a branch"!

3. Готово! Не нужно нажимать Save.

---

### Шаг 4: Добавьте GitHub Secrets

**⚠️ КРИТИЧНО: без этого build упадет!**

1. Откройте Secrets:
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/secrets/actions
   ```

2. Нажмите **"New repository secret"** для каждого:

#### Обязательные:

**Secret #1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://bbayqzqlqgqipohulcsd.supabase.co`

**Secret #2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Ваш Supabase anon key (из вашего `.env`)

#### Опциональные:

**Secret #3:**
- **Name:** `VITE_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_...` (если используете Stripe)

**Secret #4:**
- **Name:** `VITE_GOOGLE_MAPS_API_KEY`
- **Value:** `AIza...` (если используете Google Maps)

---

### Шаг 5: Настройте base в vite.config.ts (если нужно)

Откройте `/vite.config.ts`:

#### Вариант A: Universal (текущий) - работает для большинства случаев
```typescript
base: './',  // ✅ Уже настроено!
```

#### Вариант B: Для custom domain (katia.com)
```typescript
base: '/',
```

#### Вариант C: Для GitHub Pages без custom domain
```typescript
base: '/katia-platform/',  // ЗАМЕНИТЕ на название ВАШЕГО репозитория!
```

**Рекомендация:** Оставьте `base: './'` - это работает универсально!

Если изменили:
```bash
git add vite.config.ts
git commit -m "🔧 Configure base path"
git push origin main
```

---

### Шаг 6: Проверьте деплой

1. **Actions:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/actions
   ```

2. Дождитесь ✅ зеленой галочки (~2-3 минуты)

3. **Ваш сайт:**
   ```
   https://YOUR_USERNAME.github.io/katia-platform/
   ```

---

## 🔍 Важные детали для React + Vite

### ✅ Что делает Vite build:

```bash
npm run build
```

- Создает папку `dist/`
- Минифицирует JS/CSS
- Оптимизирует assets
- Создает `index.html` с правильными путями

### ✅ SPA Routing:

- `public/404.html` перенаправляет на `index.html`
- React Router обрабатывает все маршруты
- Прямые ссылки (например `/salons`) работают!

### ✅ Environment Variables:

- **Frontend (VITE_*):** Встраиваются в build, безопасны для браузера
- **Backend (без VITE_):** НЕ добавляются в GitHub Secrets, используются на Supabase Edge Functions

### ✅ Assets:

- Все файлы из `public/` копируются в `dist/`
- Иконки, manifest.json, service-worker.js - все на месте
- Пути относительные, работают корректно

---

## ❌ Частые ошибки и решения

### Build Failed: "Missing environment variables"

**Проблема:** GitHub не видит секреты

**Решение:**
1. Проверьте Settings → Secrets → Actions
2. Имена ТОЧНЫЕ: `VITE_SUPABASE_URL` (не `SUPABASE_URL`)
3. Re-run workflow: Actions → Failed workflow → Re-run all jobs

---

### Page not found (404)

**Проблема:** Неправильный `base` path

**Решение:**
1. Для универсальности: `base: './'` (текущая настройка)
2. Для GitHub Pages: `base: '/repo-name/'` (название репо!)
3. Для custom domain: `base: '/'`

После изменения:
```bash
git add vite.config.ts
git commit -m "🔧 Fix base path"
git push origin main
```

---

### White screen / Blank page

**Диагностика:**
1. F12 → Console → есть ошибки?
2. Network → загружаются ли JS/CSS?

**Частые причины:**
- Неправильный base path → см. выше
- Отсутствуют secrets → добавьте
- Ошибка в коде → проверьте локально:
  ```bash
  npm run build
  npm run preview
  ```

---

### Supabase не подключается

**Проблема:** "Failed to fetch"

**Решение:**
1. Проверьте секреты добавлены
2. Supabase Dashboard → Settings → API → CORS
3. Добавьте URL: `https://YOUR_USERNAME.github.io`

---

## 🔄 Обновление сайта

После первого деплоя обновления очень просты:

```bash
# Внесите изменения в код
# Коммит и пуш:
git add .
git commit -m "✨ Add new feature"
git push origin main

# Автоматический деплой через 2 минуты!
```

---

## 🌐 Custom Domain (опционально)

### Хотите katia.com вместо username.github.io?

#### 1. Настройте DNS (у регистратора домена):

```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

#### 2. GitHub Pages Custom Domain:

1. Settings → Pages → Custom domain
2. Введите: `www.katia.com`
3. Save
4. ✅ Enforce HTTPS (после проверки DNS)

#### 3. Обновите vite.config.ts:

```typescript
base: '/',  // Для custom domain
```

```bash
git add vite.config.ts
git commit -m "🌐 Setup custom domain"
git push origin main
```

**⏱️ DNS изменения занимают 1-24 часа**

---

## 📊 Проверка перед деплоем

- [ ] ✅ `.gitignore` создан
- [ ] ✅ `.env` НЕ коммитится (проверьте: `git status`)
- [ ] ✅ GitHub репозиторий создан
- [ ] ✅ vite.config.ts настроен
- [ ] ✅ GitHub Secrets добавлены (минимум 2)
- [ ] ✅ Локально работает: `npm run build && npm run preview`

---

## 🎯 После успешного деплоя

### Проверьте:
- [ ] Главная страница загружается
- [ ] Навигация работает (клик по ссылкам)
- [ ] Авторизация работает (Supabase подключен)
- [ ] Градиенты и стили применяются
- [ ] Нет ошибок в консоли (F12)
- [ ] Mobile responsive работает

### Добавьте бейджи в README (опционально):

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/katia-platform/actions/workflows/deploy.yml/badge.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)
```

---

## 💡 Pro Tips

### 1. Тестируйте production build локально:

```bash
npm run build
npm run preview
# Откройте http://localhost:4173
```

### 2. Мониторьте деплои:

```
https://github.com/YOUR_USERNAME/katia-platform/deployments
```

### 3. Используйте environment preview (для PR):

Создайте отдельный workflow для preview деплоев pull requests.

### 4. Кеширование в Vite:

Vite автоматически добавляет hash к файлам → кеширование работает идеально!

---

## 📚 Дополнительные ресурсы

- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [React Router на GitHub Pages](https://create-react-app.dev/docs/deployment/#github-pages)

---

## ✅ Готово!

**Все файлы настроены для вашего React + Vite проекта!**

**Следующий шаг:** Выполните Шаг 1-6 выше и через 5 минут ваш Katia Platform будет live! 🚀

---

**💜 Создано специально для Katia Platform**

**URL после деплоя:** `https://YOUR_USERNAME.github.io/katia-platform/`

**Успешного деплоя! 🎉**
