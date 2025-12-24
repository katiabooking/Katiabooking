# 📸 Визуальная инструкция - GitHub Pages Setup

## Шаг 1: Откройте Settings

```
GitHub → Ваш репозиторий → Settings (верхнее меню)
┌─────────────────────────────────────────┐
│ ← Code  Issues  Pull requests  Actions │
│                                Settings │ ← Нажмите сюда
└─────────────────────────────────────────┘
```

---

## Шаг 2: Найдите Pages в боковом меню

```
Settings → Левая панель
┌──────────────────┐
│ General          │
│ Collaborators    │
│ Branches         │
│ ...              │
│ Pages            │ ← Нажмите сюда
│ Environments     │
└──────────────────┘
```

---

## Шаг 3: Настройте Source

```
Pages → Build and deployment
┌───────────────────────────────────────┐
│ Source                                │
│ ┌───────────────────────────────────┐ │
│ │ Deploy from a branch         ▼   │ │ ← Раскройте выпадающий список
│ └───────────────────────────────────┘ │
│                                       │
│ Выберите:                             │
│ ┌───────────────────────────────────┐ │
│ │ GitHub Actions              ✓    │ │ ← Выберите этот вариант
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
```

---

## Шаг 4: Actions Workflow

```
После push в репозиторий:
GitHub → Actions (верхнее меню)

┌──────────────────────────────────────────────┐
│ All workflows                                │
│                                              │
│ ✅ Deploy to GitHub Pages                   │ ← Должна быть зеленая галочка
│    #1: Push to main                          │
│    2 minutes ago                             │
│                                              │
│ Если есть ❌ красный крестик:                │
│    → Нажмите на workflow                     │
│    → Посмотрите логи ошибки                  │
└──────────────────────────────────────────────┘
```

---

## Шаг 5: Проверьте URL

```
Settings → Pages

После успешного деплоя вы увидите:

┌───────────────────────────────────────────┐
│ Your site is live at                      │
│                                           │
│ 🌐 https://username.github.io/repo-name/  │ ← Ваш URL
│                                           │
│ [ Visit site ]                            │ ← Нажмите чтобы открыть
└───────────────────────────────────────────┘
```

---

## 🎯 Важные моменты

### ✅ Правильно:
```
Source: GitHub Actions
Status: ✅ Deploy succeeded
URL: Active and clickable
```

### ❌ Неправильно:
```
Source: Deploy from a branch  ← Должно быть GitHub Actions!
Status: ❌ Failed
URL: Not available or 404
```

---

## 🔧 Troubleshooting

### Если Actions показывает ❌ (ошибка):

1. **Кликните на failed workflow**
2. **Откройте "build" job**
3. **Посмотрите логи** - там будет причина ошибки

Частые ошибки:
- ❌ `npm ci` failed → Удалите `package-lock.json`, запустите `npm install`
- ❌ Build failed → Проверьте синтаксис в коде
- ❌ Upload failed → Проверьте permissions в Settings → Actions

### Если сайт показывает 404:

1. **Проверьте vite.config.ts:**
   ```typescript
   base: '/your-repo-name/',  // ← Должно совпадать с именем репо
   ```

2. **Проверьте Source:**
   Settings → Pages → Source = `GitHub Actions` ✅

3. **Проверьте Actions:**
   Actions tab → Последний workflow должен быть ✅ зеленым

---

## 📱 Мобильная версия GitHub

Если настраиваете с телефона:

1. Откройте **браузер** (не приложение GitHub)
2. Перейдите на `github.com`
3. Включите **Desktop site** в настройках браузера
4. Следуйте инструкции выше

---

## 🎉 Готово!

После настройки каждый push в `main` будет:
1. Автоматически собирать проект ⚙️
2. Деплоить на GitHub Pages 🚀
3. Обновлять ваш сайт 🌐

**Больше ничего настраивать не нужно!**
