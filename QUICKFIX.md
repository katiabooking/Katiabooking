# ⚡ Quick Fix Guide

Быстрые решения распространенных проблем.

## 🔥 React "createRoot" Warning

**Ошибка:**
```
Warning: You are calling ReactDOMClient.createRoot() on a container 
that has already been passed to createRoot() before.
```

**Быстрый фикс:**

```bash
# 1. Перезапустить dev server
npm run dev
```

✅ **Это нормально в dev режиме с React.StrictMode!**

**Если warning мешает:**

```bash
# Включить подавление (только dev)
echo "VITE_DEBUG=false" >> .env.local
npm run dev
```

**Объяснение:**
- React 18 StrictMode монтирует компоненты **дважды** в dev
- Это помогает находить bugs
- В production **не происходит**
- Все механизмы защиты уже реализованы в проекте

---

## 🧪 Tests Fail

```bash
# Полная очистка и перезапуск тестов
rm -rf node_modules coverage .vitest
npm install
npm test
```

---

## 🏗️ Build Fails

```bash
# Очистить кеш и пересобрать
rm -rf dist node_modules/.vite
npm install
npm run build
```

---

## 🔐 Env Variables Not Working

```bash
# 1. Проверить что есть префикс VITE_
cat .env.local | grep VITE_

# 2. Перезапустить dev server
npm run dev

# 3. В production проверить GitHub Secrets
# Settings → Secrets → Actions
```

---

## 📦 node_modules Issues

```bash
# Полная переустановка
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deploy Fails on GitHub Pages

```bash
# 1. Проверить base URL в vite.config.ts
base: './',

# 2. Проверить GitHub Secrets
# Settings → Secrets → Actions
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY

# 3. Локальный тест deploy
npm run build
npm run preview
```

---

## 💥 Nuclear Option (Полная перезагрузка)

```bash
# ОСТОРОЖНО: Удалит все незакоммиченные изменения
git reset --hard HEAD
git clean -fd
rm -rf node_modules package-lock.json dist coverage
npm install
npm run dev
```

---

## 📖 Подробная документация

- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Полный гайд
- [TESTING.md](/TESTING.md) - Тестирование
- [README.md](/README.md) - Общая информация

---

**Проблема не решена?**

[Создать Issue](https://github.com/OWNER/katia/issues/new/choose) с:
- Описанием проблемы
- Шагами воспроизведения
- Console logs
- Версией Node/npm

---

**Last updated:** 2025-12-25
