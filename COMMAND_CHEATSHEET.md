# ⚡ Быстрая шпаргалка - Команды для копирования

## 🚀 Базовая настройка и деплой

```bash
# 1. Закоммитить изменения
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main

# 2. После этого деплой будет автоматическим!
```

---

## 🔧 Возможные варианты base в vite.config.ts

### Вариант 1: Обычный репозиторий (katia-booking)
```typescript
base: '/katia-booking/',
```

### Вариант 2: Username.github.io репозиторий  
```typescript
base: './',
```

### Вариант 3: Свой домен (katia.beauty)
```typescript
base: '/',
```

---

## 📝 Git команды для быстрого фикса

### Если нужно изменить только base path:
```bash
# Откройте vite.config.ts, измените base: '...'
git add vite.config.ts
git commit -m "Fix: Update base path for GitHub Pages"
git push
```

### Если нужно отменить последний commit:
```bash
git reset --soft HEAD~1  # Отменить commit, оставить изменения
git reset --hard HEAD~1  # Отменить commit и изменения
```

### Если нужно force push (осторожно!):
```bash
git push --force origin main
```

---

## 🔍 Проверка статуса деплоя

### Через командную строку (GitHub CLI):
```bash
gh run list --limit 1  # Последний workflow
gh run watch           # Следить за текущим запуском
```

### Через браузер:
```
https://github.com/USERNAME/REPO-NAME/actions
```

---

## 🧪 Локальная проверка перед деплоем

```bash
# Собрать production build
npm run build

# Проверить локально
npm run preview

# Откройте: http://localhost:4173
```

---

## 🛠️ Troubleshooting команды

### Очистить node_modules и переустановить:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Очистить build кеш:
```bash
rm -rf dist
npm run build
```

### Проверить синтаксис package.json:
```bash
npm install  # Покажет ошибки если есть
```

---

## 📱 GitHub Mobile (через браузер)

### Получить desktop версию на мобильном:

**iOS Safari:**
1. Тапните на **aA** в адресной строке
2. Выберите **Request Desktop Website**

**Android Chrome:**
1. Меню (⋮) → **Desktop site** ✓

---

## 🌐 После успешного деплоя

### Проверить сайт:
```bash
# Замените на ваши значения
open https://USERNAME.github.io/REPO-NAME/

# Или просто:
# Settings → Pages → Visit site (кнопка)
```

### Проверить билд локально:
```bash
npm run preview
```

### Обновить деплой (если нужно):
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## 🔐 GitHub Pages настройки (URL-ы для быстрого доступа)

```
# Settings
https://github.com/USERNAME/REPO-NAME/settings

# Pages settings
https://github.com/USERNAME/REPO-NAME/settings/pages

# Actions
https://github.com/USERNAME/REPO-NAME/actions

# Environments
https://github.com/USERNAME/REPO-NAME/settings/environments
```

---

## 💾 Бэкап перед изменениями

```bash
# Создать ветку для бэкапа
git checkout -b backup-before-pages
git push origin backup-before-pages

# Вернуться на main
git checkout main
```

---

## 🎯 Один файл = один фикс

### Только base path:
```bash
git add vite.config.ts
git commit -m "Fix: GitHub Pages base path"
git push
```

### Только workflow:
```bash
git add .github/workflows/deploy.yml
git commit -m "Fix: GitHub Actions workflow"
git push
```

### Только 404 страница:
```bash
git add public/404.html
git commit -m "Add: 404 redirect for SPA"
git push
```

---

## 🔄 Частые команды

### Статус:
```bash
git status
```

### Последние коммиты:
```bash
git log --oneline -5
```

### Отменить все локальные изменения:
```bash
git restore .
```

### Синхронизировать с remote:
```bash
git pull origin main
```

---

## 📊 Проверка после деплоя

### Чеклист:
- [ ] Главная страница загружается
- [ ] Переход между страницами работает  
- [ ] CSS стили применены
- [ ] Изображения загружаются
- [ ] Нет 404 ошибок в Console

### Проверка в DevTools:
```javascript
// В Console браузера:
console.log('Base URL:', import.meta.env.BASE_URL);
```

---

## 🚨 Emergency: Откатить деплой

```bash
# Вернуться к предыдущему коммиту
git revert HEAD
git push origin main

# Или к конкретному коммиту
git revert COMMIT_HASH
git push origin main
```

---

## 🎓 Полезные алиасы для .bashrc/.zshrc

```bash
# Добавьте в ~/.bashrc или ~/.zshrc
alias deploy="git add . && git commit -m 'Deploy' && git push"
alias gp="git push origin main"
alias gs="git status"
alias gl="git log --oneline -5"
```

Потом используйте:
```bash
deploy  # Вместо трех команд
```

---

## ✅ Все готово!

**Скопируйте нужные команды и используйте!**

Самая важная:
```bash
git add .
git commit -m "Configure GitHub Pages"
git push origin main
```

**Больше ничего не нужно! 🎉**
