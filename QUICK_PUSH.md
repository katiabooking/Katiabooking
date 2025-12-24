# ⚡ БЫСТРЫЙ СТАРТ: ONE-CLICK PUSH

## 🎯 Для Windows (САМЫЙ ПРОСТОЙ):

### Двойной клик на файл:

```
push.bat
```

**ВОТ И ВСЁ!** ✨

---

## 🚀 Альтернативные способы:

### PowerShell (Windows):
```powershell
.\push.ps1
```

### Bash (Linux/Mac/Git Bash):
```bash
./push.sh
```

### npm (Универсально):
```bash
npm run git:deploy
```

---

## 📋 Что произойдёт:

```
✅ git add .            (добавит все файлы)
✅ git commit -m "..."  (создаст коммит с timestamp)
✅ git push origin main (запушит в GitHub)
✅ GitHub Actions       (автоматически задеплоит сайт)
```

---

## ⏱️ Результат через 2-3 минуты:

```
🌐 Ваш сайт обновлён!
   https://YOUR_USERNAME.github.io/Katiabooking/
```

---

## 🔧 Если не работает:

### Windows - push.bat не запускается:

**Просто используйте npm:**
```bash
npm run git:deploy
```

### PowerShell - "cannot be loaded":

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\push.ps1
```

### Bash - "Permission denied":

```bash
chmod +x push.sh
./push.sh
```

---

## 📚 Подробная инструкция:

👉 **[AUTO_PUSH_GUIDE.md](./AUTO_PUSH_GUIDE.md)**

---

## 🎉 НАЧНИТЕ ПРЯМО СЕЙЧАС:

### Вариант A (Windows - РЕКОМЕНДУЕТСЯ):

1. Двойной клик на **push.bat**
2. Готово! ✨

### Вариант B (Универсальный):

```bash
npm run git:deploy
```

---

**💜 Katia Platform - ONE-CLICK DEPLOY готов!** 🚀
