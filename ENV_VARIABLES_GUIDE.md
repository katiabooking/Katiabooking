# 🔐 Environment Variables - Полное руководство

## 📋 Содержание
1. [Быстрый старт](#быстрый-старт)
2. [Обязательные переменные](#обязательные-переменные)
3. [Опциональные переменные](#опциональные-переменные)
4. [Настройка для разных окружений](#настройка-для-разных-окружений)
5. [Безопасность](#безопасность)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Быстрый старт

### Шаг 1: Создайте .env файл

Файл `.env` уже создан с текущими значениями Supabase!

### Шаг 2: Обновите секретные ключи

Откройте `.env` и замените placeholder значения:

```bash
# Найдите и замените:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
EMAIL_API_KEY=re_your_api_key_here
```

### Шаг 3: Перезапустите dev сервер

```bash
# Остановите текущий сервер (Ctrl+C)
# Запустите заново:
npm run dev
```

**Готово!** Переменные окружения подключены.

---

## 📝 Обязательные переменные

### 1. Supabase (уже настроено ✅)

```env
SUPABASE_URL=https://bbayqzqlqgqipohulcsd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Где получить:**
- Dashboard: https://supabase.com/dashboard
- Project → Settings → API

**Для чего:**
- Подключение к базе данных
- Аутентификация пользователей
- File storage

---

### 2. Supabase Service Role Key (для бэкенда)

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Где получить:**
- Supabase Dashboard → Settings → API → `service_role` (secret)

**⚠️ ВАЖНО:**
- НИКОГДА не используйте во фронтенде!
- Только для Supabase Edge Functions (бэкенд)
- Имеет полный доступ к БД (bypass RLS)

**Настройка для Edge Functions:**
```bash
# Локально (для dev):
echo "SUPABASE_SERVICE_ROLE_KEY=your_key" >> .env

# Production (Supabase):
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

---

### 3. Stripe Keys (для платежей)

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Публичный ключ
STRIPE_SECRET_KEY=sk_test_...        # Секретный ключ
STRIPE_WEBHOOK_SECRET=whsec_...      # Webhook secret
```

**Где получить:**
1. Зарегистрируйтесь на https://stripe.com
2. Dashboard → Developers → API keys
3. Используйте Test keys для разработки

**Test mode vs Live mode:**
- Test keys: `pk_test_...` / `sk_test_...`
- Live keys: `pk_live_...` / `sk_live_...`

**Настройка Webhook:**
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `customer.subscription.updated`, etc.
4. Скопируйте Webhook signing secret

---

## 🎨 Опциональные переменные

### Email Service (Resend)

```env
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=noreply@katia.beauty
```

**Настройка:**
1. Зарегистрируйтесь: https://resend.com
2. Dashboard → API Keys → Create API Key
3. Verify domain для production

**Альтернативы:**
- SendGrid: https://sendgrid.com
- Mailgun: https://mailgun.com
- AWS SES: https://aws.amazon.com/ses/

---

### SMS Service (Twilio)

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

**Настройка:**
1. Зарегистрируйтесь: https://www.twilio.com
2. Console → Account → Account SID
3. Console → Auth Token
4. Buy a phone number

---

### Push Notifications (Web Push)

```env
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

**Генерация ключей:**
```bash
npx web-push generate-vapid-keys
```

---

## 🌍 Настройка для разных окружений

### Development (локальная разработка)

**.env** (локально):
```env
ENVIRONMENT=development
APP_URL=http://localhost:5173
DEBUG=true
USE_MOCK_DATA=false

# Test Stripe keys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

### Staging (тестовый сервер)

**Vercel/Netlify Environment Variables:**
```env
ENVIRONMENT=staging
APP_URL=https://staging.katia.beauty
DEBUG=true

# Test Stripe keys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

### Production (живой сайт)

**Production Environment Variables:**
```env
ENVIRONMENT=production
APP_URL=https://katia.beauty
DEBUG=false

# Live Stripe keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

**⚠️ КРИТИЧНО для Production:**
- Используйте только Live keys
- Включите HTTPS
- DEBUG=false
- Не храните секреты в коде!

---

## 🔒 Безопасность

### ✅ ЧТО ДЕЛАТЬ:

1. **Добавьте .env в .gitignore** (✅ уже сделано)
   ```gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Используйте разные ключи для dev и prod**
   - Development: Test keys
   - Production: Live keys

3. **Никогда не коммитьте:**
   - `.env` файлы
   - API keys в коде
   - Passwords
   - Private keys

4. **Используйте переменные окружения хостинга:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment
   - GitHub Actions: Settings → Secrets

5. **Для фронтенда используйте префикс VITE_:**
   ```env
   # ✅ Безопасно для фронтенда
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   VITE_APP_URL=https://katia.beauty
   
   # ❌ Только для бэкенда (без VITE_)
   STRIPE_SECRET_KEY=sk_test_...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

---

### ❌ ЧЕГО НЕ ДЕЛАТЬ:

```typescript
// ❌ НЕ ДЕЛАЙТЕ ТАК:
const secretKey = "sk_live_abc123...";  // Hardcoded secret

// ❌ НЕ ДЕЛАЙТЕ ТАК:
git add .env
git commit -m "Add env file"  // Секреты в git!

// ❌ НЕ ДЕЛАЙТЕ ТАК:
const apiKey = import.meta.env.STRIPE_SECRET_KEY;  // Secret key во фронтенде!

// ✅ ПРАВИЛЬНО:
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

---

## 🛠️ Настройка для GitHub Pages

### Frontend переменные (с VITE_):

**Создайте в GitHub:**
1. Repository → Settings → Secrets and variables → Actions
2. New repository secret:
   ```
   Name: VITE_SUPABASE_URL
   Value: https://bbayqzqlqgqipohulcsd.supabase.co
   ```

3. Обновите workflow (`.github/workflows/deploy.yml`):
   ```yaml
   - name: Build
     env:
       VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
       VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
     run: npm run build
   ```

---

## 🧪 Тестирование переменных

### Проверка в коде:

```typescript
// frontend (с VITE_)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('App URL:', import.meta.env.VITE_APP_URL);

// backend (без VITE_)
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
console.log('Stripe configured:', !!stripeKey);
```

### Проверка в браузере:

Откройте DevTools Console:
```javascript
// Проверить доступные переменные
console.log(import.meta.env);

// Должны быть видны только VITE_ переменные
// Секретные ключи (без VITE_) НЕ должны быть видны!
```

---

## 🐛 Troubleshooting

### Проблема: "Cannot access import.meta.env"

**Решение:**
1. Перезапустите dev сервер:
   ```bash
   # Ctrl+C для остановки
   npm run dev
   ```

2. Очистите кеш:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

---

### Проблема: "Переменная undefined"

**Проверьте:**

1. ✅ Файл `.env` существует в корне проекта
2. ✅ Переменная начинается с `VITE_` (для фронтенда)
3. ✅ Нет пробелов вокруг `=`:
   ```env
   # ✅ Правильно:
   VITE_API_URL=https://api.com
   
   # ❌ Неправильно:
   VITE_API_URL = https://api.com
   ```
4. ✅ Dev сервер перезапущен после изменения .env

---

### Проблема: "CORS error при обращении к Supabase"

**Решение:**
1. Проверьте SUPABASE_URL и SUPABASE_ANON_KEY
2. Убедитесь что домен добавлен в Supabase:
   - Dashboard → Authentication → URL Configuration
   - Site URL: `http://localhost:5173` (dev)
   - Redirect URLs: `http://localhost:5173/**`

---

### Проблема: "Stripe webhook не работает"

**Решение:**
1. Проверьте STRIPE_WEBHOOK_SECRET
2. Используйте Stripe CLI для локального тестирования:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. На production: используйте настоящий webhook endpoint

---

## 📚 Дополнительные ресурсы

### Документация:
- Vite Env: https://vitejs.dev/guide/env-and-mode.html
- Supabase Env: https://supabase.com/docs/guides/cli/managing-environments
- Stripe Keys: https://stripe.com/docs/keys

### Инструменты:
- Doppler: https://www.doppler.com/ (управление secrets)
- Vault: https://www.vaultproject.io/ (хранение secrets)
- 1Password CLI: https://1password.com/downloads/command-line/

---

## ✅ Чеклист настройки

Перед деплоем проверьте:

- [ ] `.env` файл создан
- [ ] `.env` добавлен в `.gitignore`
- [ ] Все обязательные переменные заполнены
- [ ] VITE_ префикс для frontend переменных
- [ ] Service Role Key ТОЛЬКО в бэкенде
- [ ] Test keys для development
- [ ] Live keys для production
- [ ] Webhook secrets настроены
- [ ] Email/SMS сервисы настроены (если нужны)
- [ ] Dev сервер перезапущен

---

**Готово! Все переменные окружения настроены правильно!** ✨
