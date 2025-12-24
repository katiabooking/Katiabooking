# 🚀 ДЕПЛОЙ НА WINDOWS (PowerShell)

## ✅ ВСЁ ГОТОВО К ДЕПЛОЮ!

**Все исправления применены:**
- ✅ Node.js 20.x
- ✅ package-lock.json создан
- ✅ --legacy-peer-deps для React 18/19
- ✅ Environment variables настроены

---

## ⚡ ЗАПУСТИТЕ ДЕПЛОЙ (1 команда!):

### Скопируйте и вставьте в PowerShell:

```powershell
git add .github/workflows/deploy.yml package-lock.json ; git commit -m "🚀 Deploy: Fix all issues (lock file + legacy-peer-deps)" ; git push origin main
```

**Нажмите Enter и ждите!** ✨

---

## 🔍 Что будет происходить:

### 1. Git push (10 секунд)
```
Counting objects...
Writing objects: 100% (4/4), done.
✅ To github.com:YOUR_USERNAME/Katiabooking.git
   abc1234..def5678  main -> main
```

### 2. GitHub Actions запустится автоматически (2-3 минуты)

**Откройте в браузере:**
```
https://github.com/YOUR_USERNAME/Katiabooking/actions
```

**Вы увидите:**
```
⏳ 🚀 Deploy to GitHub Pages
   Running...
   
   Build (in progress):
   ✅ Checkout
   ✅ Setup Node.js 20.x
   ⏳ Install dependencies (npm ci --legacy-peer-deps)
```

### 3. После успешного деплоя:

```
✅ 🚀 Deploy to GitHub Pages
   Completed in 2m 34s
   
   ✅ Build
   ✅ Deploy
```

---

## 🔑 ВАЖНО: Добавьте GitHub Secrets!

**Без этого build упадёт!**

### Шаг 1: Откройте настройки

```
https://github.com/YOUR_USERNAME/Katiabooking/settings/secrets/actions
```

**Замените YOUR_USERNAME на ваш GitHub username!**

### Шаг 2: Нажмите "New repository secret"

### Шаг 3: Добавьте первый секрет

```
Name:  VITE_SUPABASE_URL
Value: https://bbayqzqlqgqipohulcsd.supabase.co
```

Нажмите **"Add secret"**

### Шаг 4: Добавьте второй секрет

```
Name:  VITE_SUPABASE_ANON_KEY
Value: [ваш ключ - см. ниже где взять]
```

Нажмите **"Add secret"**

---

## 🔑 Где взять VITE_SUPABASE_ANON_KEY:

### Вариант A: Из Supabase Dashboard (РЕКОМЕНДУЕТСЯ)

1. **Откройте:**
   ```
   https://supabase.com/dashboard/project/bbayqzqlqgqipohulcsd/settings/api
   ```

2. **Найдите секцию "Project API keys"**

3. **Скопируйте "anon public" ключ:**
   ```
   eyJhbGc...очень_длинный_ключ...xyz
   ```
   (начинается с `eyJ` и очень длинный)

4. **Вставьте как Value в GitHub Secret**

### Вариант B: Из локального .env файла

Если у вас есть файл `.env` локально:

```powershell
cat .env
```

Найдите строку:
```
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Скопируйте значение после `=`

---

## 📊 Проверка деплоя:

### Откройте GitHub Actions:

```
https://github.com/YOUR_USERNAME/Katiabooking/actions
```

### Если Secrets добавлены - увидите:

```
✅ 🏗️ Build with environment variables
   
   VITE_SUPABASE_URL: ***
   VITE_SUPABASE_ANON_KEY: ***
   
   > vite build
   
   ✅ Build completed successfully!
   dist/index.html                  0.50 kB
   dist/assets/index-abc123.css     123 kB
   dist/assets/index-def456.js      456 kB
```

### Если Secrets НЕ добавлены - ошибка:

```
❌ 🏗️ Build with environment variables
   
   Error: VITE_SUPABASE_URL is not defined
```

**Решение:** Добавьте Secrets (см. выше) и нажмите "Re-run all jobs"

---

## 🎉 После успешного деплоя:

### Ваш сайт будет доступен:

```
https://YOUR_USERNAME.github.io/Katiabooking/
```

**Замените YOUR_USERNAME на ваш GitHub username!**

**Примеры:**
- Если username: `john-doe` → `https://john-doe.github.io/Katiabooking/`
- Если username: `alice123` → `https://alice123.github.io/Katiabooking/`

---

## 🔧 Если workflow упал с ошибкой:

### Ошибка: "npm ci --legacy-peer-deps failed"

**Причина:** Конфликт зависимостей

**Решение:**
1. Проверьте что файлы закоммичены:
   ```powershell
   git status
   ```
   Должно быть: `nothing to commit, working tree clean`

2. Если есть незакоммиченные изменения:
   ```powershell
   git add .github/workflows/deploy.yml package-lock.json
   git commit -m "Fix: Update files"
   git push origin main
   ```

---

### Ошибка: "VITE_SUPABASE_URL is not defined"

**Причина:** GitHub Secrets не добавлены

**Решение:**
1. Добавьте Secrets (см. раздел выше)
2. Откройте Actions → Failed workflow
3. Нажмите "Re-run all jobs"

---

### Ошибка: "Permission denied (publickey)"

**Причина:** SSH ключ не настроен

**Решение:**
```powershell
# Проверьте что используете HTTPS, а не SSH
git remote -v
```

Если видите `git@github.com`, измените на HTTPS:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/Katiabooking.git
```

Потом снова push:
```powershell
git push origin main
```

---

## 💡 Pro Tips для PowerShell:

### 1. Проверка что файлы созданы:

```powershell
# Проверить deploy.yml
cat .github/workflows/deploy.yml

# Проверить package-lock.json
cat package-lock.json | Select-Object -First 10
```

### 2. Git Bash как альтернатива:

Если PowerShell даёт проблемы, используйте **Git Bash**:

1. Откройте Git Bash из меню Пуск
2. Там работают Linux команды с `&&`:
   ```bash
   git add .github/workflows/deploy.yml package-lock.json && git commit -m "Deploy" && git push origin main
   ```

### 3. Мониторинг workflow в реальном времени:

Установите GitHub CLI:
```powershell
winget install GitHub.cli
```

Потом:
```powershell
gh run watch
```

Покажет живой лог деплоя в терминале!

---

## 📋 Полный чеклист:

Убедитесь что сделали всё:

- [ ] ✅ Скопировали PowerShell команду
- [ ] ✅ Запустили в PowerShell (git add + commit + push)
- [ ] ✅ Push прошёл успешно
- [ ] ✅ Открыли GitHub Actions
- [ ] ✅ Добавили VITE_SUPABASE_URL секрет
- [ ] ✅ Добавили VITE_SUPABASE_ANON_KEY секрет
- [ ] ✅ Workflow запустился
- [ ] ✅ Build прошёл успешно (✅ зелёная галочка)
- [ ] ✅ Deploy завершился
- [ ] ✅ Открыли сайт в браузере
- [ ] 🎉 **ГОТОВО!**

---

## 🚀 НАЧНИТЕ ПРЯМО СЕЙЧАС:

### 1. Скопируйте команду:

```powershell
git add .github/workflows/deploy.yml package-lock.json ; git commit -m "🚀 Deploy: Fix all issues" ; git push origin main
```

### 2. Откройте PowerShell

Нажмите `Win + X` → "Windows PowerShell"

### 3. Перейдите в папку проекта:

```powershell
cd C:\Users\pc\Desktop\FigmaProject
```

### 4. Вставьте команду и нажмите Enter

### 5. Ждите результат:

```
[main abc1234] 🚀 Deploy: Fix all issues
 2 files changed, 150 insertions(+)
 create mode 100644 .github/workflows/deploy.yml
 create mode 100644 package-lock.json
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 2.34 KiB | 2.34 MiB/s, done.
Total 4 (delta 1), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/Katiabooking.git
   abc1234..def5678  main -> main
```

### 6. Откройте Actions:

```
https://github.com/YOUR_USERNAME/Katiabooking/actions
```

### 7. Добавьте Secrets (если ещё не сделали)

### 8. Через 2-3 минуты - ГОТОВО! 🎉

---

## 🎊 Поздравляю!

**Ваш сайт Katia Platform теперь live!**

**URL:**
```
https://YOUR_USERNAME.github.io/Katiabooking/
```

**Следующий push в main будет автоматически деплоиться!** ✨

---

## 📚 Дополнительные материалы:

- **[FIX_REACT_CONFLICT.md](./FIX_REACT_CONFLICT.md)** - React 18/19 конфликт
- **[PACKAGE_LOCK_SOLUTION.md](./PACKAGE_LOCK_SOLUTION.md)** - package-lock.json
- **[PEER_DEPS_FIX.md](./PEER_DEPS_FIX.md)** - Подробно о --legacy-peer-deps
- **[START_DEPLOY.md](./START_DEPLOY.md)** - Общая инструкция

---

**💜 Katia Platform - успешно задеплоен с Windows!** 🚀

**Замените YOUR_USERNAME на ваш GitHub username во всех ссылках!**
