# ⚡ GitHub Pages - Быстрый старт (3 минуты)

## 🎯 Цель
Опубликовать Katia Platform на GitHub Pages за 3 минуты!

---

## 📋 Чеклист

### ✅ Шаг 1: Создайте GitHub репозиторий (30 секунд)

1. Перейдите на [github.com/new](https://github.com/new)
2. **Repository name:** `katia-platform` (или другое имя)
3. **Visibility:** Public (для бесплатного GitHub Pages)
4. Нажмите **"Create repository"**

### ✅ Шаг 2: Подключите локальный проект (30 секунд)

```bash
# В терминале (в папке проекта):
git init
git add .
git commit -m "🎉 Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git
git branch -M main
git push -u origin main
```

**⚠️ Замените `YOUR_USERNAME` на ваш GitHub username!**

---

### ✅ Шаг 3: Настройте GitHub Pages (1 минута)

1. **Откройте Settings вашего репозитория:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/pages
   ```

2. **Build and deployment → Source:**
   - Выберите: **GitHub Actions**

3. **Готово!** Не нажимайте Save, GitHub Actions настроен автоматически.

---

### ✅ Шаг 4: Добавьте Environment Variables (1 минута)

**⚠️ КРИТИЧНО: без этого сайт не заработает!**

1. **Откройте Secrets:**
   ```
   https://github.com/YOUR_USERNAME/katia-platform/settings/secrets/actions
   ```

2. **Нажмите "New repository secret"** и добавьте:

#### 🔑 Обязательные:

**Secret 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Secret:** `https://bbayqzqlqgqipohulcsd.supabase.co`
- Нажмите **"Add secret"**

**Secret 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Secret:** Ваш Supabase anon key (из `.env` файла)
- Нажмите **"Add secret"**

#### 💳 Опционально (если используете Stripe):

**Secret 3:**
- **Name:** `VITE_STRIPE_PUBLISHABLE_KEY`
- **Secret:** `pk_test_...` (ваш Stripe publishable key)
- Нажмите **"Add secret"**

---

### ✅ Шаг 5: Обновите vite.config.ts (30 секунд)

Откройте `/vite.config.ts` и проверьте `base`:

```typescript
export default defineConfig({
  // Для custom domain (katia.com):
  base: '/',
  
  // ИЛИ для GitHub Pages (username.github.io/katia-platform):
  // base: '/katia-platform/',  // ⚠️ ЗАМЕНИТЕ на название ВАШЕГО репозитория!
  
  // ... остальное без изменений
})
```

**Правила:**
- ✅ Custom domain: `base: '/'`
- ✅ GitHub Pages: `base: '/ваш-репозиторий/'`
- ⚠️ Слеши в начале и конце обязательны!

---

### ✅ Шаг 6: Пуш и деплой (30 секунд)

```bash
git add .
git commit -m "🚀 Setup GitHub Pages"
git push origin main
```

**🎉 Готово! GitHub Actions автоматически задеплоит ваш сайт!**

---

## 🔍 Проверка деплоя

### 1. Откройте Actions:
```
https://github.com/YOUR_USERNAME/katia-platform/actions
```

### 2. Найдите workflow "🚀 Deploy to GitHub Pages"

- ⏳ **Orange** = В процессе (подождите 2-3 минуты)
- ✅ **Green** = Успех! Сайт опубликован
- ❌ **Red** = Ошибка (см. [Troubleshooting](#-troubleshooting))

### 3. Ваш сайт доступен через 1-2 минуты:

```
https://YOUR_USERNAME.github.io/katia-platform/
```

**⚠️ Замените `YOUR_USERNAME` и `katia-platform` на ваши значения!**

---

## 🎯 Финальный чеклист

- [ ] ✅ GitHub репозиторий создан
- [ ] ✅ Код запушен в `main` ветку
- [ ] ✅ GitHub Pages source = `GitHub Actions`
- [ ] ✅ Secrets добавлены (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] ✅ `vite.config.ts` → `base` настроен
- [ ] ✅ GitHub Actions workflow запущен (зеленая галочка)
- [ ] ✅ Сайт открывается по URL

---

## ❌ Troubleshooting

### Build Failed?

1. **Откройте Actions → Failed workflow → Build**
2. **Раскройте failed step** (красный крестик)
3. **Проверьте ошибку:**

**Ошибка: "Environment variables not found"**
- ✅ Добавьте секреты: `Settings → Secrets and variables → Actions`
- ✅ Имена ТОЧНО: `VITE_SUPABASE_URL` (не `SUPABASE_URL`!)
- ✅ После добавления: `Actions → Re-run all jobs`

**Ошибка: "Build failed"**
- ✅ Проверьте локально: `npm run build`
- ✅ Если работает локально, проверьте секреты

### Page not found (404)?

- ✅ Проверьте `base` в `vite.config.ts`
- ✅ Для GitHub Pages: `base: '/katia-platform/'` (название вашего репо!)
- ✅ После изменения: `git push origin main`

### White screen / Blank page?

- ✅ Откройте DevTools (F12) → Console → есть ошибки?
- ✅ Проверьте что секреты добавлены
- ✅ Проверьте `base` path

---

## 🔄 Обновление сайта

После первого деплоя, обновлять очень просто:

```bash
# 1. Внесите изменения в код
# 2. Коммит и пуш:
git add .
git commit -m "✨ Update feature"
git push origin main

# 3. Автоматический деплой через 2-3 минуты!
```

---

## 🌐 Custom Domain (опционально)

### Хотите использовать свой домен (katia.com)?

1. **Настройте DNS у регистратора:**
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

2. **GitHub Pages → Custom domain:**
   - Settings → Pages → Custom domain: `www.katia.com`
   - ✅ Enforce HTTPS

3. **Обновите vite.config.ts:**
   ```typescript
   base: '/',  // Для custom domain
   ```

4. **Пуш:**
   ```bash
   git push origin main
   ```

**⏱️ DNS изменения занимают до 24 часов**

---

## 📚 Полная документация

Нужно больше деталей? Смотрите:
- 📖 [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) - Полное руководство
- 📖 [GitHub Pages Docs](https://docs.github.com/en/pages)

---

## ✅ Готово!

**🎉 Ваш Katia Platform опубликован на GitHub Pages!**

```
🌐 URL: https://YOUR_USERNAME.github.io/katia-platform/
📊 Actions: https://github.com/YOUR_USERNAME/katia-platform/actions
⚙️ Settings: https://github.com/YOUR_USERNAME/katia-platform/settings/pages
```

**Следующие шаги:**
- [ ] Поделитесь ссылкой с командой
- [ ] Настройте custom domain (опционально)
- [ ] Добавьте Google Analytics
- [ ] Настройте SEO

---

**Создано с 💜 для Katia Platform**
