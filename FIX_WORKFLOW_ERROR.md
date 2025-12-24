# ✅ Исправление ошибки GitHub Actions Workflow

## 🔴 Проблема:

GitHub запускает **СТАРЫЙ** workflow `static.yml`, который:
- ❌ НЕ содержит environment variables
- ❌ Не настроен для Vite
- ❌ Упадет с ошибкой

## ✅ Решение:

### Шаг 1: Удалите старый `static.yml` workflow

#### Вариант A: Через GitHub UI (рекомендуется)

1. **Откройте ваш репозиторий на GitHub:**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO
   ```

2. **Перейдите в `.github/workflows/`:**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/tree/main/.github/workflows
   ```

3. **Найдите файл `static.yml`** (если есть)

4. **Удалите его:**
   - Кликните на файл
   - Нажмите на иконку мусорки (🗑️) справа
   - Commit changes

#### Вариант B: Через Git команды

```bash
# Если файл находится в локальном репо
git rm .github/workflows/static.yml
git commit -m "🗑️ Remove old static.yml workflow"
git push origin main
```

---

### Шаг 2: Убедитесь что новый workflow на месте

Файл **уже создан** и находится в правильном месте:

```
✅ /.github/workflows/deploy.yml
```

После push он появится на GitHub.

---

### Шаг 3: Push обновления на GitHub

```bash
# Добавьте новый workflow
git add .github/workflows/deploy.yml

# Commit
git commit -m "✨ Add correct GitHub Actions workflow with env variables"

# Push
git push origin main
```

---

### Шаг 4: Отключите старый workflow (если не можете удалить)

Если старый `static.yml` все еще триггерится:

1. **Откройте Actions на GitHub:**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/actions
   ```

2. **Найдите "static.yml" в списке workflows слева**

3. **Кликните на "..." (три точки) → Disable workflow**

---

## 🔍 Почему это произошло?

### Проблема #1: Неправильное расположение

**Было (неправильно):**
```
/workflows/deploy.yml  ❌
```

**Стало (правильно):**
```
/.github/workflows/deploy.yml  ✅
```

GitHub Actions ищет workflows **ТОЛЬКО** в папке `.github/workflows/`!

---

### Проблема #2: Отсутствие environment variables

**Старый workflow (static.yml):**
```yaml
- name: Build
  run: npm run build
  # ❌ НЕТ env секции!
```

**Новый workflow (deploy.yml):**
```yaml
- name: 🏗️ Build
  run: npm run build
  env:
    # ✅ Environment Variables из GitHub Secrets
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

Без `env:` секции Vite не видит переменные окружения и build падает!

---

## ✅ Проверка после исправления

### 1. Убедитесь что есть только один workflow:

```
/.github/workflows/deploy.yml  ✅
```

### 2. Проверьте что Secrets добавлены:

Settings → Secrets → Actions:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

### 3. Push изменения и проверьте Actions:

```bash
git push origin main
```

Откройте:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

Должен запуститься **"🚀 Deploy to GitHub Pages"** (не "static.yml")!

---

## 🎯 Ожидаемый результат

После исправления в Actions вы должны увидеть:

```
✅ 🚀 Deploy to GitHub Pages
   ├─ 🏗️ Build (успешно)
   └─ 🚀 Deploy (успешно)
```

**Время выполнения:** ~2-3 минуты

---

## ❌ Частые ошибки после исправления

### Ошибка: "secret not found"

**Проблема:** Secrets не добавлены или имя неправильное

**Решение:**
1. Settings → Secrets → Actions
2. Проверьте **ТОЧНЫЕ** имена:
   - `VITE_SUPABASE_URL` (не `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (не `SUPABASE_KEY`)

---

### Ошибка: "npm ERR! missing script: build"

**Проблема:** Нет npm build скрипта

**Решение:**

Откройте `package.json` и проверьте:
```json
{
  "scripts": {
    "build": "vite build"  // ✅ Должен быть
  }
}
```

---

### Workflow все еще не запускается

**Проблема:** Файл в неправильном месте

**Решение:**

Проверьте структуру:
```bash
ls -la .github/workflows/
```

Должно быть:
```
.github/
  └─ workflows/
      └─ deploy.yml  ✅
```

НЕ должно быть:
```
workflows/         ❌
  └─ deploy.yml
```

---

## 🚀 Финальные команды (скопируйте все сразу)

```bash
# 1. Удалите старый workflow если есть (опционально)
git rm .github/workflows/static.yml 2>/dev/null || echo "static.yml not found locally"

# 2. Добавьте новый правильный workflow
git add .github/workflows/deploy.yml

# 3. Добавьте другие изменения
git add .gitignore .env.example

# 4. Commit
git commit -m "✨ Fix GitHub Actions workflow + add env variables support"

# 5. Push
git push origin main

# 6. Откройте Actions
echo "Откройте: https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
```

**Замените `YOUR_USERNAME` и `YOUR_REPO` на ваши!**

---

## 📊 До и После

### ❌ До (ошибка):

```
Workflow: static.yml
Status: ❌ Failure
Проблема: Нет environment variables
```

### ✅ После (работает):

```
Workflow: 🚀 Deploy to GitHub Pages (deploy.yml)
Status: ✅ Success
Build: ✅ С правильными env variables
Deploy: ✅ На GitHub Pages
```

---

## 💡 Pro Tips

### 1. Проверьте локально перед push:

```bash
# Установите переменные локально (временно)
export VITE_SUPABASE_URL="https://bbayqzqlqgqipohulcsd.supabase.co"
export VITE_SUPABASE_ANON_KEY="your_key"

# Build
npm run build

# Preview
npm run preview
```

### 2. Мониторьте workflow в реальном времени:

```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

Кликните на запущенный workflow → смотрите логи live!

### 3. Re-run failed workflow:

Если исправили Secrets, но workflow уже упал:
- Actions → Failed workflow → "Re-run all jobs"

---

## ✅ Готово!

**После выполнения этих шагов:**

1. ✅ Старый `static.yml` удален
2. ✅ Новый `deploy.yml` с env variables работает
3. ✅ GitHub Actions успешно деплоит на Pages
4. ✅ Ваш сайт live через ~3 минуты! 🎉

---

**💜 Katia Platform - правильный workflow настроен!**
