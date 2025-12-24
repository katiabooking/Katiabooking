# 💻 Git Commands - Готовые команды для копирования

## 🎯 Первая публикация

### Шаг 1: Инициализация Git

```bash
# Инициализировать Git (если еще не сделано)
git init

# Проверить статус
git status
```

---

### Шаг 2: Первый коммит

```bash
# Добавить все файлы
git add .

# Проверить что будет закоммичено (опционально)
git status

# Первый коммит
git commit -m "🎉 Initial commit - Katia Platform ready for deployment"
```

---

### Шаг 3: Подключение GitHub репозитория

**⚠️ ЗАМЕНИТЕ `YOUR_USERNAME` и `katia-platform` на ваши значения!**

```bash
# Добавить remote origin
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git

# Проверить remote (опционально)
git remote -v

# Создать main ветку и запушить
git branch -M main
git push -u origin main
```

---

## 🔄 Обновление после изменений

### Стандартный workflow:

```bash
# Проверить статус (какие файлы изменились)
git status

# Добавить все изменения
git add .

# Коммит с описанием
git commit -m "✨ Add new feature"

# Пуш в GitHub (автоматический деплой!)
git push origin main
```

---

### Примеры commit messages:

```bash
# Новая фича
git commit -m "✨ Add booking calendar feature"

# Исправление бага
git commit -m "🐛 Fix login authentication issue"

# Обновление стилей
git commit -m "💄 Update homepage gradient colors"

# Обновление документации
git commit -m "📝 Update README with deployment guide"

# Улучшение производительности
git commit -m "⚡ Optimize image loading performance"

# Настройка конфигурации
git commit -m "🔧 Configure GitHub Pages base path"

# Безопасность
git commit -m "🔒 Add environment variables protection"

# Удаление кода
git commit -m "🔥 Remove deprecated components"

# Тесты
git commit -m "✅ Add unit tests for booking system"
```

---

## 🌿 Работа с ветками

### Создание feature ветки:

```bash
# Создать и переключиться на новую ветку
git checkout -b feature/booking-calendar

# Работайте над фичей, коммитьте изменения
git add .
git commit -m "✨ Add calendar component"

# Пуш feature ветки
git push origin feature/booking-calendar

# После ревью: переключиться на main и смержить
git checkout main
git merge feature/booking-calendar
git push origin main

# Удалить feature ветку (опционально)
git branch -d feature/booking-calendar
git push origin --delete feature/booking-calendar
```

---

## 🔍 Полезные команды для проверки

### Проверка статуса и истории:

```bash
# Текущий статус (какие файлы изменены)
git status

# История коммитов
git log --oneline --graph --all

# История коммитов (красиво)
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# Показать изменения в файлах
git diff

# Показать изменения в конкретном файле
git diff src/app/App.tsx

# Показать что будет закоммичено
git diff --cached
```

---

## 🔙 Отмена изменений

### Отменить изменения в файле:

```bash
# Отменить изменения в конкретном файле (до add)
git checkout -- src/app/App.tsx

# Отменить все изменения (до add)
git checkout -- .

# Убрать файл из staging (после add, но до commit)
git reset HEAD src/app/App.tsx

# Отменить последний коммит (но сохранить изменения)
git reset --soft HEAD~1

# Отменить последний коммит (и удалить изменения) ⚠️ ОПАСНО
git reset --hard HEAD~1
```

---

## 🆘 Если что-то пошло не так

### Забыли добавить файлы в последний коммит:

```bash
# Добавьте забытые файлы
git add forgotten-file.tsx

# Дополните последний коммит
git commit --amend --no-edit

# Пуш с force (если уже пушили)
git push --force origin main
```

---

### Конфликты при pull:

```bash
# Попытка pull
git pull origin main

# Если конфликты:
# 1. Откройте конфликтные файлы в редакторе
# 2. Разрешите конфликты (удалите маркеры <<<, ===, >>>)
# 3. Добавьте разрешенные файлы:
git add .

# 4. Завершите merge
git commit -m "🔀 Merge conflict resolution"

# 5. Пуш
git push origin main
```

---

### Откатиться к предыдущей версии:

```bash
# Посмотреть историю
git log --oneline

# Откатиться к конкретному коммиту (КОПИЯ, безопасно)
git revert abc123

# ИЛИ hard reset (УДАЛЯЕТ историю) ⚠️ ОПАСНО
git reset --hard abc123
git push --force origin main
```

---

## 🔐 Проверка .gitignore

### Убедитесь что .env НЕ коммитится:

```bash
# Проверить что .env игнорируется
git status

# Если .env показывается в списке - ПРОБЛЕМА!
# Убедитесь что .gitignore содержит:
cat .gitignore | grep .env

# Если .env уже закоммичен, удалите из истории:
git rm --cached .env
git commit -m "🔒 Remove .env from tracking"
git push origin main
```

---

## 🌐 GitHub Pages деплой

### Триггернуть деплой вручную:

```bash
# Пустой коммит для запуска GitHub Actions
git commit --allow-empty -m "🚀 Trigger deployment"
git push origin main
```

---

### Изменить base path:

```bash
# Откройте vite.config.ts и измените base
# Затем:
git add vite.config.ts
git commit -m "🔧 Update base path for GitHub Pages"
git push origin main
```

---

## 📊 GitHub CLI (опционально)

### Если установлен GitHub CLI:

```bash
# Создать репозиторий прямо из терминала
gh repo create katia-platform --public --source=. --remote=origin

# Открыть репозиторий в браузере
gh repo view --web

# Открыть Actions
gh run list

# Посмотреть последний workflow
gh run view

# Создать Pull Request
gh pr create --title "Add new feature" --body "Description"

# Открыть настройки репозитория
gh repo edit --homepage https://katia.beauty
```

---

## 🎯 Быстрые команды для копирования

### Первая публикация (все сразу):

```bash
git init && \
git add . && \
git commit -m "🎉 Initial commit - Katia Platform" && \
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git && \
git branch -M main && \
git push -u origin main
```

**⚠️ ЗАМЕНИТЕ `YOUR_USERNAME/katia-platform`!**

---

### Обновление (все сразу):

```bash
git add . && \
git commit -m "✨ Update features" && \
git push origin main
```

---

### Проверка перед коммитом:

```bash
git status && \
git diff
```

---

## 🔄 Синхронизация с удаленным репозиторием

### Получить последние изменения:

```bash
# Fetch (загрузить информацию о изменениях)
git fetch origin

# Pull (загрузить и применить изменения)
git pull origin main

# Pull с rebase (чище история)
git pull --rebase origin main
```

---

## 🏷️ Теги и релизы

### Создание версий:

```bash
# Создать тег
git tag v1.0.0

# Создать тег с сообщением
git tag -a v1.0.0 -m "🎉 First stable release"

# Пуш тега
git push origin v1.0.0

# Пуш всех тегов
git push origin --tags

# Посмотреть все теги
git tag -l

# Удалить тег
git tag -d v1.0.0
git push origin --delete v1.0.0
```

---

## 📝 Git Config

### Настройка Git (первый раз):

```bash
# Установить имя
git config --global user.name "Your Name"

# Установить email
git config --global user.email "your.email@example.com"

# Проверить настройки
git config --list

# Настроить редактор (опционально)
git config --global core.editor "code --wait"

# Включить цвета
git config --global color.ui auto

# Алиасы для быстроты
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.ps push
git config --global alias.pl pull

# Теперь можно использовать:
git st    # вместо git status
git cm -m "message"  # вместо git commit -m "message"
```

---

## 🎨 Эмодзи для коммитов

```bash
🎉 :tada: - Начало проекта
✨ :sparkles: - Новая фича
🐛 :bug: - Исправление бага
📝 :memo: - Документация
💄 :lipstick: - UI/стили
⚡ :zap: - Производительность
🔒 :lock: - Безопасность
🔧 :wrench: - Конфигурация
🔥 :fire: - Удаление кода
✅ :white_check_mark: - Тесты
🚀 :rocket: - Деплой
🔀 :twisted_rightwards_arrows: - Merge
♻️ :recycle: - Рефакторинг
⬆️ :arrow_up: - Апгрейд зависимостей
⬇️ :arrow_down: - Даунгрейд зависимостей
```

---

## 🆘 Экстренные команды

### Все сломалось, откатить все:

```bash
# ОПАСНО: Удалить ВСЕ локальные изменения
git reset --hard HEAD
git clean -fd

# Синхронизировать с удаленным репозиторием
git fetch origin
git reset --hard origin/main
```

---

### Удалить последние N коммитов:

```bash
# Удалить последний коммит (сохранить изменения)
git reset --soft HEAD~1

# Удалить последние 3 коммита (сохранить изменения)
git reset --soft HEAD~3

# Удалить последний коммит (УДАЛИТЬ изменения) ⚠️
git reset --hard HEAD~1

# Пуш с force
git push --force origin main
```

---

## 📚 Дополнительные ресурсы

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Gitmoji](https://gitmoji.dev/)

---

## ✅ Чеклист перед push

- [ ] `git status` - проверили что коммитите
- [ ] `.env` НЕ в списке файлов (должен быть в .gitignore)
- [ ] Тест локально: `npm run build` успешен
- [ ] Commit message понятный и описательный
- [ ] Если публичный проект - проверили что нет секретов в коде

---

**💜 Создано для Katia Platform**

**Нужна помощь?** См. [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) для troubleshooting
