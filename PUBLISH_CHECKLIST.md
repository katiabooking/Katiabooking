# ✅ Чеклист публикации Katia Platform на GitHub Pages

## 📊 Статус готовности

### ✅ Подготовка завершена:

- [x] **`.gitignore`** - создан, защищает `.env` и секреты
- [x] **`.env.example`** - документирует все переменные окружения
- [x] **`.github/workflows/deploy.yml`** - GitHub Actions workflow готов
- [x] **`vite.config.ts`** - настроен с `base: './'`
- [x] **`404.html`** - SPA routing для GitHub Pages
- [x] **`index.html`** - SPA redirect script добавлен
- [x] **Documentation** - полные руководства созданы

---

## 🚀 Шаги для публикации

### 📦 Шаг 1: Проверьте файлы (30 секунд)

```bash
# Проверьте что файлы на месте:
ls .gitignore                    # ✅ Должен существовать
ls .env.example                  # ✅ Должен существовать
ls .github/workflows/deploy.yml  # ✅ Должен существовать
ls vite.config.ts               # ✅ Должен существовать
```

Если что-то отсутствует - файлы уже созданы в проекте!

---

### 🔧 Шаг 2: Настройте vite.config.ts (1 минута)

Откройте `/vite.config.ts` и проверьте настройку `base`:

#### Вариант A: Для custom domain (katia.com)

```typescript
export default defineConfig({
  base: '/',
  // ...
})
```

#### Вариант B: Для GitHub Pages (username.github.io/repo-name)

```typescript
export default defineConfig({
  base: '/katia-platform/',  // ⚠️ ЗАМЕНИТЕ на название ВАШЕГО репозитория!
  // ...
})
```

**Правила:**
- Custom domain → `base: '/'`
- GitHub Pages → `base: '/имя-репозитория/'`
- Обязательно слеши: `'/repo/'` (не `'repo'` или `'/repo'`)

---

### 📝 Шаг 3: Создайте GitHub репозиторий (2 минуты)

#### 3.1. На GitHub.com:

1. Перейдите: [github.com/new](https://github.com/new)
2. **Repository name:** `katia-platform` (или другое имя)
3. **Description:** "💜 Katia - Beauty Salon Booking Platform"
4. **Visibility:** 
   - ✅ **Public** (бесплатный GitHub Pages)
   - ❌ Private (требует GitHub Pro)
5. **НЕ добавляйте:** README, .gitignore, license (уже есть локально)
6. Нажмите **"Create repository"**

#### 3.2. В терминале (локально):

```bash
# Инициализируйте Git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Первый коммит
git commit -m "🎉 Initial commit - Katia Platform ready for deployment"

# Добавьте remote origin (ЗАМЕНИТЕ на ваш URL!)
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git

# Создайте main ветку и запушьте
git branch -M main
git push -u origin main
```

**⚠️ ЗАМЕНИТЕ:**
- `YOUR_USERNAME` → ваш GitHub username
- `katia-platform` → название вашего репозитория

---

### 🔐 Шаг 4: Настройте GitHub Pages (1 минута)

1. **Откройте Settings вашего репозитория:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/pages
   ```

2. **Build and deployment:**
   - **Source:** Выберите **"GitHub Actions"**
   - НЕ выбирайте "Deploy from a branch"

3. **Готово!** GitHub Actions уже настроен через `.github/workflows/deploy.yml`

---

### 🔑 Шаг 5: Добавьте Environment Secrets (3 минуты)

**⚠️ КРИТИЧНО: без этого сайт не заработает!**

1. **Откройте Secrets настройки:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/secrets/actions
   ```

2. **Нажмите "New repository secret"** для каждого секрета:

#### 🟢 ОБЯЗАТЕЛЬНЫЕ секреты:

##### Secret #1: Supabase URL
- **Name:** `VITE_SUPABASE_URL`
- **Secret:** `https://bbayqzqlqgqipohulcsd.supabase.co`
- Нажмите **"Add secret"**

##### Secret #2: Supabase Anon Key
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Secret:** Скопируйте из вашего `.env` файла
  ```bash
  # Чтобы посмотреть ключ:
  cat .env | grep VITE_SUPABASE_ANON_KEY
  ```
- Нажмите **"Add secret"**

#### 🔵 ОПЦИОНАЛЬНЫЕ секреты (если используете):

##### Secret #3: Stripe Publishable Key
- **Name:** `VITE_STRIPE_PUBLISHABLE_KEY`
- **Secret:** `pk_test_...` или `pk_live_...`
- Нажмите **"Add secret"**

##### Secret #4: Google Maps API
- **Name:** `VITE_GOOGLE_MAPS_API_KEY`
- **Secret:** `AIza...`
- Нажмите **"Add secret"**

#### ✅ Проверка секретов:

После добавления вы должны видеть:
```
VITE_SUPABASE_URL          ✓
VITE_SUPABASE_ANON_KEY     ✓
VITE_STRIPE_PUBLISHABLE_KEY ✓ (опционально)
VITE_GOOGLE_MAPS_API_KEY   ✓ (опционально)
```

**⚠️ Значения секретов скрыты (GitHub их не показывает)**

---

### 🚀 Шаг 6: Запустите деплой (1 минута)

GitHub Actions запустится автоматически после пуша, но давайте убедимся:

1. **Откройте Actions:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/actions
   ```

2. **Вы должны увидеть workflow:**
   - 🟠 **Orange** = В процессе (подождите 2-3 минуты)
   - ✅ **Green** = Готово!
   - ❌ **Red** = Ошибка (см. ниже)

#### Если workflow НЕ запустился автоматически:

```bash
# Сделайте пустой коммит чтобы триггернуть Actions:
git commit --allow-empty -m "🚀 Trigger GitHub Pages deployment"
git push origin main
```

---

### 🎉 Шаг 7: Проверка сайта (2 минуты)

#### 7.1. Дождитесь зеленой галочки в Actions

- ⏳ **Build** должен завершиться (~2 минуты)
- ✅ **Deploy** должен успешно выполниться

#### 7.2. Откройте ваш сайт:

**Если `base: '/'` (custom domain):**
```
https://YOUR_USERNAME.github.io/
```

**Если `base: '/katia-platform/'`:**
```
https://YOUR_USERNAME.github.io/katia-platform/
```

**⚠️ ЗАМЕНИТЕ `YOUR_USERNAME` и `katia-platform`!**

#### 7.3. Проверьте функциональность:

- [ ] ✅ Главная страница загружается
- [ ] ✅ Навигация работает (переход между страницами)
- [ ] ✅ Авторизация работает (Supabase подключен)
- [ ] ✅ Стили применяются (градиенты, цвета)
- [ ] ✅ Нет ошибок в консоли (F12 → Console)

---

## 🔍 Troubleshooting

### ❌ Build Failed: "Environment variables not found"

**Проблема:** GitHub не видит ваши secrets

**Решение:**
1. Проверьте что добавили секреты: `Settings → Secrets → Actions`
2. Имена должны быть ТОЧНЫЕ: `VITE_SUPABASE_URL` (не `SUPABASE_URL`)
3. После добавления секретов:
   - `Actions → Failed workflow → Re-run all jobs`

---

### ❌ Page not found (404)

**Проблема:** Неправильный `base` path

**Решение:**
1. Откройте `/vite.config.ts`
2. Проверьте `base`:
   ```typescript
   // Для GitHub Pages (username.github.io/katia-platform):
   base: '/katia-platform/',  // Должно совпадать с названием репозитория!
   
   // Для custom domain:
   base: '/',
   ```
3. Пуш изменений:
   ```bash
   git add vite.config.ts
   git commit -m "🔧 Fix base path"
   git push origin main
   ```

---

### ❌ White screen / Blank page

**Проблема:** Ошибки в коде или неправильная конфигурация

**Диагностика:**
1. Откройте DevTools (F12)
2. Вкладка **Console** → есть ошибки?
3. Вкладка **Network** → загружаются ли файлы?

**Частые причины:**
- Неправильный `base` path → см. выше
- Отсутствуют secrets → добавьте секреты
- Ошибки в коде → проверьте локально:
  ```bash
  npm run build
  npm run preview
  ```

---

### ❌ Supabase connection fails

**Проблема:** "Failed to fetch" в консоли

**Решение:**
1. Проверьте секреты в GitHub:
   - `VITE_SUPABASE_URL` ✓
   - `VITE_SUPABASE_ANON_KEY` ✓

2. Проверьте CORS в Supabase:
   - Dashboard → Settings → API
   - Добавьте URL: `https://YOUR_USERNAME.github.io`

3. Проверьте что используете `anon` key (не `service_role`)

---

### ❌ GitHub Actions не запускается

**Проблема:** Workflow stuck или не появляется

**Решение:**
1. **Проверьте что Actions включен:**
   - `Settings → Actions → General`
   - ✅ "Allow all actions and reusable workflows"

2. **Проверьте permissions:**
   - `Settings → Actions → General → Workflow permissions`
   - ✅ "Read and write permissions"

3. **Для приватных репозиториев:**
   - Нужен GitHub Pro plan
   - Или сделайте репозиторий публичным

---

## 🌐 Custom Domain (опционально)

### Хотите использовать домен katia.com?

#### Шаг 1: Настройте DNS

У вашего регистратора (Namecheap, GoDaddy) добавьте:

**Для www.katia.com:**
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
TTL: 3600
```

**Для apex domain (katia.com):**
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

#### Шаг 2: GitHub Pages Custom Domain

1. `Settings → Pages → Custom domain`
2. Введите: `www.katia.com` или `katia.com`
3. Нажмите **Save**
4. Подождите проверку DNS (может занять до 24ч)
5. ✅ Включите **"Enforce HTTPS"**

#### Шаг 3: Обновите vite.config.ts

```typescript
export default defineConfig({
  base: '/',  // Для custom domain всегда '/'
  // ...
})
```

#### Шаг 4: Пуш

```bash
git add vite.config.ts
git commit -m "🌐 Setup custom domain"
git push origin main
```

---

## 🔄 Обновление сайта

После первой публикации, обновлять сайт очень просто:

```bash
# 1. Внесите изменения в код
# 2. Коммит и пуш:
git add .
git commit -m "✨ Add new feature"
git push origin main

# 3. GitHub Actions автоматически обновит сайт через 2-3 минуты!
```

---

## 📊 Мониторинг деплоев

### Где смотреть статус:

1. **GitHub Actions:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/actions
   ```

2. **GitHub Pages settings:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/pages
   ```
   - Показывает последний successful deployment
   - URL вашего сайта

3. **Deployments:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/deployments
   ```
   - История всех деплоев
   - Статусы и timestamps

---

## 📚 Полезные ссылки

### Документация проекта:
- [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) - Полное руководство
- [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - Быстрый старт
- [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md) - Environment variables
- [README.md](./README.md) - Главная документация

### GitHub Pages:
- [Официальная документация](https://docs.github.com/en/pages)
- [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions](https://docs.github.com/en/actions)

### Supabase:
- [Dashboard](https://supabase.com/dashboard)
- [CORS настройка](https://supabase.com/docs/guides/api#cors)
- [API Keys](https://supabase.com/docs/guides/api/api-keys)

---

## 🎯 Финальный чеклист

Перед тем как считать деплой завершенным, проверьте:

### Pre-deployment:
- [ ] `.gitignore` создан
- [ ] `.env` НЕ коммитится в Git
- [ ] `vite.config.ts` настроен (`base` корректный)
- [ ] `.github/workflows/deploy.yml` существует

### GitHub Setup:
- [ ] Репозиторий создан
- [ ] Код запушен в `main`
- [ ] GitHub Pages source = `GitHub Actions`
- [ ] Secrets добавлены (минимум 2: Supabase URL и Key)

### Deployment:
- [ ] GitHub Actions workflow запущен
- [ ] Build успешен (✅ зеленая галочка)
- [ ] Deploy успешен
- [ ] Сайт доступен по URL

### Testing:
- [ ] Главная страница загружается
- [ ] Навигация работает
- [ ] Supabase подключен (авторизация работает)
- [ ] Нет ошибок в консоли
- [ ] Стили применяются корректно
- [ ] Responsive дизайн работает (mobile/desktop)

### Optional:
- [ ] Custom domain настроен (если нужен)
- [ ] HTTPS включен
- [ ] Google Analytics добавлен
- [ ] SEO meta tags проверены

---

## ✅ Готово!

**🎉 Поздравляем! Katia Platform успешно опубликована на GitHub Pages!**

```
🌐 Live URL: https://YOUR_USERNAME.github.io/katia-platform/
📊 Actions: https://github.com/YOUR_USERNAME/katia-platform/actions
⚙️ Settings: https://github.com/YOUR_USERNAME/katia-platform/settings/pages
```

### Что дальше?

1. **Поделитесь ссылкой** с командой и тестерами
2. **Мониторьте ошибки** через консоль браузера
3. **Собирайте фидбек** от пользователей
4. **Обновляйте регулярно** через `git push`

---

**Создано с 💜 для Katia Platform**

**Нужна помощь?** Откройте issue в репозитории или проверьте [Troubleshooting](#-troubleshooting)
