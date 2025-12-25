# 📸 Supabase Storage Integration - Quick Start

## ✅ Все готово! Система настроена и работает.

---

## 🚀 ЗАПУСК И ТЕСТИРОВАНИЕ:

### **1. Запусти приложение:**
```bash
npm run dev
```

### **2. Открой демо-страницу в браузере:**
```
http://localhost:5173/#/image-storage-demo
```

### **3. Что увидишь:**
- 🎨 Красивая UI с фиолетово-розовым градиентом
- 📁 Выбор папок: logos, products, certificates, masters, gallery, avatars
- ⬆️ Drag & drop upload area
- 🖼️ Галерея загруженных изображений
- 🗑️ Возможность удалять изображения

### **4. Протестируй:**
```
✅ Выбери папку "logos"
✅ Перетащи PNG/JPG изображение (или кликни)
✅ Дождись загрузки (увидишь ✅ зеленую галочку)
✅ Изображение появится в галерее справа
✅ Наведи на картинку → кнопка "Delete"
```

---

## 💻 ИСПОЛЬЗОВАНИЕ В КОДЕ:

### **Вариант A: Готовый компонент (рекомендуется)**

```tsx
import { ImageUploader } from './components/ImageUploader';
import { IMAGE_FOLDERS } from '../utils/supabaseStorage';

function MyForm() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <ImageUploader
      folder={IMAGE_FOLDERS.LOGOS}
      onUploadComplete={(url) => {
        setImageUrl(url);
        console.log('Uploaded:', url);
      }}
      label="Upload Image"
    />
  );
}
```

### **Вариант B: React Hook**

```tsx
import { useImageUpload } from '../hooks/useImageUpload';
import { IMAGE_FOLDERS } from '../utils/supabaseStorage';

function MyComponent() {
  const { uploadImageFile, uploading, imageUrl } = useImageUpload();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImageFile(file, IMAGE_FOLDERS.PRODUCTS);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

### **Вариант C: Прямой вызов функций**

```tsx
import { uploadImage, listImages, deleteImage, IMAGE_FOLDERS } from '../utils/supabaseStorage';

// Upload
const url = await uploadImage(file, IMAGE_FOLDERS.LOGOS);

// List
const { files } = await listImages(IMAGE_FOLDERS.PRODUCTS);

// Delete
await deleteImage('logos/123456-abc.png');
```

---

## 📁 ДОСТУПНЫЕ ПАПКИ:

```typescript
IMAGE_FOLDERS.LOGOS         // Логотипы салонов
IMAGE_FOLDERS.PRODUCTS      // Фото продуктов
IMAGE_FOLDERS.CERTIFICATES  // Дизайны сертификатов
IMAGE_FOLDERS.MASTERS       // Фото мастеров
IMAGE_FOLDERS.GALLERY       // Галерея работ
IMAGE_FOLDERS.AVATARS       // Аватары пользователей
IMAGE_FOLDERS.GENERAL       // Общие изображения
```

---

## 🎯 ИНТЕГРАЦИЯ В СУЩЕСТВУЮЩИЕ ФОРМЫ:

### **1. Форма создания салона:**
```tsx
// В SalonRegisterPage.tsx
import { ImageUploader } from './components/ImageUploader';
import { IMAGE_FOLDERS } from '../utils/supabaseStorage';

// Добавь в форму:
<ImageUploader
  folder={IMAGE_FOLDERS.LOGOS}
  onUploadComplete={(url) => setSalonData({
    ...salonData,
    logoUrl: url
  })}
  label="Логотип салона"
/>
```

### **2. Форма добавления продукта:**
```tsx
<ImageUploader
  folder={IMAGE_FOLDERS.PRODUCTS}
  onUploadComplete={(url) => setProduct({
    ...product,
    imageUrl: url
  })}
  label="Фото продукта"
/>
```

### **3. Профиль пользователя:**
```tsx
<ImageUploader
  folder={IMAGE_FOLDERS.AVATARS}
  onUploadComplete={(url) => updateUserAvatar(url)}
  currentImageUrl={user.avatarUrl}
  label="Аватар"
/>
```

---

## 📊 API:

**Base URL:** `https://{projectId}.supabase.co/functions/v1/make-server-3e5c72fb`

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/storage/upload` | POST | Загрузить изображение |
| `/storage/images/:folder?` | GET | Список изображений |
| `/storage/delete` | DELETE | Удалить изображение |
| `/storage/public-url/*` | GET | Получить публичный URL |

---

## 📚 ДОКУМЕНТАЦИЯ:

- **Полная документация:** `/docs/SUPABASE_STORAGE.md`
- **Quick Setup:** `/IMAGE_STORAGE_SETUP.md`
- **Complete Summary:** `/SUPABASE_STORAGE_COMPLETE.md`
- **Fix Log:** `/FIX_IMPORT_ERROR.md`
- **Ready Status:** `/SUPABASE_STORAGE_READY.md`

---

## ✅ CHECKLIST:

- [x] Backend routes созданы
- [x] Frontend components готовы
- [x] Demo page работает
- [x] Документация написана
- [x] Ошибки импорта исправлены
- [ ] **TODO:** Интегрировать в формы салонов
- [ ] **TODO:** Интегрировать в формы продуктов
- [ ] **TODO:** Заменить старые `/images/*` на Supabase URLs

---

## 🐛 TROUBLESHOOTING:

### Bucket не создался?
Проверь логи сервера. Должно быть:
```
✅ Bucket created: katia-images
```

### Изображения не загружаются?
1. Проверь `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` в `.env`
2. Проверь что сервер запущен
3. Открой Network tab в DevTools

### Ошибка "Failed to upload"?
1. Проверь размер файла (max 5MB)
2. Проверь тип файла (только PNG, JPG, WebP, SVG)
3. Проверь Authorization header

---

## 🎉 ГОТОВО!

Система полностью настроена и готова к использованию.

**Запускай демо:** http://localhost:5173/#/image-storage-demo 🚀

---

**Version:** 1.0.1  
**Status:** ✅ Production Ready  
**Date:** 25.12.2024
