# 🚀 Деплой Katia Platform - СЕЙЧАС!

## ⚡ 3 минуты до публикации

### Шаг 1: Создайте репозиторий (1 минута)

```bash
# В терминале (в папке проекта):
git init
git add .
git commit -m "🎉 Initial commit - Katia Platform"

# Замените YOUR_USERNAME на ваш GitHub username:
git remote add origin https://github.com/YOUR_USERNAME/katia-platform.git
git branch -M main
git push -u origin main
```

**⚠️ Сначала создайте пустой репозиторий на GitHub:** https://github.com/new

---

### Шаг 2: GitHub Pages (30 секунд)

1. Откройте: `https://github.com/YOUR_USERNAME/katia-platform/settings/pages`
2. **Source:** Выберите **"GitHub Actions"**
3. Готово!

---

### Шаг 3: Добавьте секреты (1 минута)

1. Откройте: `https://github.com/YOUR_USERNAME/katia-platform/settings/secrets/actions`
2. **New repository secret** → добавьте:

**Secret #1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://bbayqzqlqgqipohulcsd.supabase.co`

**Secret #2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: Скопируйте из `.env` файла

**Secret #3 (опционально):**
- Name: `VITE_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_test_...`

---

### Шаг 4: Настройте base (30 секунд)

Откройте `/vite.config.ts`:

```typescript
export default defineConfig({
  // Для custom domain (katia.com):
  base: '/',
  
  // ИЛИ для GitHub Pages:
  // base: '/katia-platform/',  // ЗАМЕНИТЕ на название вашего репо!
  
  // ... остальное без изменений
})
```

---

### Шаг 5: Пуш (10 секунд)

```bash
git add .
git commit -m "🚀 Ready for deployment"
git push origin main
```

---

## ✅ Готово!

**Проверьте деплой:**
1. Actions: `https://github.com/YOUR_USERNAME/katia-platform/actions`
2. Дождитесь ✅ зеленой галочки (2-3 минуты)
3. Откройте: `https://YOUR_USERNAME.github.io/katia-platform/`

---

## ❌ Не работает?

### Build failed?
- Проверьте что добавили секреты
- Имена ТОЧНО: `VITE_SUPABASE_URL` (не `SUPABASE_URL`)
- Actions → Re-run all jobs

### 404 ошибка?
- Проверьте `base` в vite.config.ts
- Должно совпадать: `base: '/katia-platform/'`

### Белый экран?
- F12 → Console → смотрите ошибки
- Проверьте что секреты добавлены

---

## 📚 Больше информации?

- 🚀 [PUBLISH_CHECKLIST.md](./PUBLISH_CHECKLIST.md) - Полный чеклист
- ⚡ [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - Детальная инструкция
- 📖 [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) - Руководство + troubleshooting

---

**💜 Katia Platform - Готово к публикации!**
