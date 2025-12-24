# 🚀 GitHub Deploy - Команды для копирования

## ⚡ Быстрый деплой (скопируйте по порядку)

### 1️⃣ Push исправленный workflow

```bash
git add .github/workflows/deploy.yml
git commit -m "🔧 Fix Node.js version + add env variables"
git push origin main
```

---

### 2️⃣ Добавьте GitHub Secrets

**Вручную через UI (рекомендуется):**

1. Откройте:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
   ```

2. Нажмите **"New repository secret"**

3. Добавьте эти 2 обязательных секрета:

   **Secret #1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://bbayqzqlqgqipohulcsd.supabase.co
   ```

   **Secret #2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: (ваш ключ из Supabase Dashboard)
   ```

---

### 3️⃣ Проверьте деплой

```bash
# Откройте Actions в браузере:
# https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# Или используйте GitHub CLI (если установлен):
gh run list
gh run watch
```

---

## 📋 Полная последовательность (все команды)

```bash
# 1. Убедитесь что вы на main ветке
git checkout main

# 2. Pull последние изменения (если работаете в команде)
git pull origin main

# 3. Добавьте исправленный workflow
git add .github/workflows/deploy.yml

# 4. Commit
git commit -m "🔧 Fix GitHub Actions workflow: Node.js + env variables"

# 5. Push (запустит автоматический деплой)
git push origin main

# 6. Откройте Actions чтобы следить за прогрессом
echo "Откройте: https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
```

---

## 🔑 Где взять значения для Secrets

### VITE_SUPABASE_URL
```
Значение: https://bbayqzqlqgqipohulcsd.supabase.co
```

### VITE_SUPABASE_ANON_KEY

1. Откройте Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/bbayqzqlqgqipohulcsd/settings/api
   ```

2. Найдите раздел **"Project API keys"**

3. Скопируйте **"anon" / "public"** ключ

4. Вставьте как значение Secret

---

## ✅ Проверка что все работает

### После push проверьте:

1. **Actions запустились:**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/actions
   ```
   
   Должен появиться workflow: **"🚀 Deploy to GitHub Pages"**

2. **Build прошел успешно:**
   ```
   ✅ 🏗️ Build
      ├─ 📥 Checkout
      ├─ 🟢 Setup Node.js (version 20.x)
      ├─ 📦 Install dependencies
      ├─ 🏗️ Build with environment variables
      └─ 📤 Upload artifact
   ```

3. **Deploy завершился:**
   ```
   ✅ 🚀 Deploy
      └─ 🚀 Deploy to GitHub Pages
   ```

4. **Сайт доступен:**
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

---

## 🐛 Если что-то пошло не так

### Ошибка: "Node version '20' not found"

**Решение:** Уже исправлено! Используется `'20.x'` вместо `'20'`.

---

### Ошибка: "secret not found"

**Проблема:** Secrets не добавлены или название неправильное.

**Решение:**
1. Settings → Secrets → Actions
2. Проверьте **ТОЧНЫЕ** имена:
   - ✅ `VITE_SUPABASE_URL` (не `SUPABASE_URL`)
   - ✅ `VITE_SUPABASE_ANON_KEY` (не `SUPABASE_KEY`)

---

### Ошибка: "npm ERR! missing script: build"

**Проблема:** Возможно неправильный `package.json`.

**Решение:** Убедитесь что в `package.json` есть:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

---

### Workflow не запускается

**Проблема:** Файл в неправильном месте или не запушен.

**Решение:**
```bash
# Проверьте структуру локально
ls -la .github/workflows/

# Должно быть:
# .github/workflows/deploy.yml

# Убедитесь что файл запушен
git status
git push origin main
```

---

## 🎯 Финальный чеклист

Перед тем как закрыть эту страницу, убедитесь:

- [ ] ✅ Workflow файл находится в `/.github/workflows/deploy.yml`
- [ ] ✅ Файл содержит `node-version: '20.x'`
- [ ] ✅ Файл содержит секцию `env:` в build шаге
- [ ] ✅ GitHub Secrets добавлены (минимум 2)
- [ ] ✅ Код запушен на GitHub
- [ ] ✅ Workflow запустился в Actions
- [ ] ✅ Нет ошибок в логах build
- [ ] ✅ Deploy завершился успешно
- [ ] ✅ Сайт открывается в браузере

---

## 🚀 Альтернатива: Deploy вручную (если Actions не работают)

Если по какой-то причине GitHub Actions не работает:

```bash
# 1. Build локально
npm run build

# 2. Установите gh-pages (если еще не установлен)
npm install --save-dev gh-pages

# 3. Добавьте script в package.json:
# "deploy": "gh-pages -d dist"

# 4. Deploy
npm run deploy
```

**Но это НЕ рекомендуется!** Используйте GitHub Actions для автоматизации.

---

## 📚 Дополнительная документация

- 🔧 [NODE_VERSION_FIX.md](./NODE_VERSION_FIX.md) - Детали исправления Node.js
- ⚡ [QUICK_FIX_NOW.md](./QUICK_FIX_NOW.md) - Быстрое исправление
- 📖 [FIX_WORKFLOW_ERROR.md](./FIX_WORKFLOW_ERROR.md) - Решение всех проблем workflow
- 🎯 [READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md) - Полный гайд по деплою

---

**💜 Katia Platform - Готово к деплою!**

**Замените:**
- `YOUR_USERNAME` → ваш GitHub username
- `YOUR_REPO` → название вашего репозитория
