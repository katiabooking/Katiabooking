# 📦 Supabase Storage - Quick Setup Guide

## ✅ Что сделано:

### **Backend (Server Routes):**
- ✅ `/supabase/functions/server/storage-routes.ts` - API для работы с изображениями
- ✅ Автоматическое создание bucket `katia-images`
- ✅ 6 endpoints: upload, list, delete, public-url, etc.

### **Frontend (Utils & Components):**
- ✅ `/src/utils/supabaseStorage.ts` - Утилиты для работы с изображениями
- ✅ `/src/hooks/useImageUpload.ts` - React hook для загрузки
- ✅ `/src/app/components/ImageUploader.tsx` - Компонент загрузки с drag & drop
- ✅ `/src/app/components/SupabaseImage.tsx` - Компонент отображения с fallback
- ✅ `/src/app/pages/ImageStorageDemo.tsx` - Демо-страница для тестирования

### **Documentation:**
- ✅ `/docs/SUPABASE_STORAGE.md` - Полная документация (API, примеры, best practices)

---

## 🚀 Как использовать:

### **1️⃣ Загрузить изображение (простой способ):**

```tsx
import { ImageUploader } from './components/ImageUploader';
import { IMAGE_FOLDERS } from '../utils/supabaseStorage';

function MyForm() {
  const [logoUrl, setLogoUrl] = useState('');

  return (
    <ImageUploader
      folder={IMAGE_FOLDERS.LOGOS}
      onUploadComplete={(url) => setLogoUrl(url)}
      label="Upload Logo"
    />
  );
}
```

### **2️⃣ Показать изображение:**

```tsx
import { SupabaseImage } from './components/SupabaseImage';

function SalonCard({ salon }) {
  return (
    <SupabaseImage
      src={salon.logoUrl}
      alt={salon.name}
      className="w-20 h-20 rounded-full object-cover"
    />
  );
}
```

### **3️⃣ Тестовая страница:**

Открой в браузере:
```
http://localhost:5173/#/image-storage-demo
```

---

## 📁 Структура папок:

```
katia-images/           # Bucket в Supabase Storage
├── logos/              # Логотипы салонов
├── products/           # Фото продуктов
├── certificates/       # Дизайны сертификатов
├── masters/            # Фото мастеров
├── gallery/            # Галерея работ
├── avatars/            # Аватары пользователей
└── general/            # Общие изображения
```

---

## 🔑 Доступные функции:

### **Utils:**
```typescript
// Загрузка
const url = await uploadImage(file, IMAGE_FOLDERS.LOGOS);

// Список
const { files } = await listImages(IMAGE_FOLDERS.PRODUCTS);

// Удаление
await deleteImage('logos/123456.png');

// Валидация
validateImageFile(file, 5); // Max 5MB
```

### **Hook:**
```typescript
const { uploadImageFile, uploading, error, imageUrl } = useImageUpload();

const handleUpload = async (file) => {
  const url = await uploadImageFile(file, IMAGE_FOLDERS.LOGOS);
  console.log('Uploaded:', url);
};
```

---

## ⚙️ Настройки:

### **Bucket Config:**
- **Name:** `katia-images`
- **Type:** Public
- **Max Size:** 5 MB per file
- **Allowed Types:** PNG, JPG, WebP, SVG
- **CDN:** Enabled (автоматически через Supabase)

### **Автоматическое создание:**
Bucket создается автоматически при первом запуске сервера.  
Проверь в логах:
```
📦 Creating bucket: katia-images
✅ Bucket created: katia-images
```

---

## 📊 Endpoints (Backend API):

| Method | Endpoint | Описание |
|--------|----------|----------|
| `POST` | `/storage/upload` | Загрузить изображение |
| `GET` | `/storage/images/:folder?` | Список изображений |
| `DELETE` | `/storage/delete` | Удалить изображение |
| `GET` | `/storage/public-url/*` | Получить публичный URL |

**Base URL:**
```
https://{projectId}.supabase.co/functions/v1/make-server-3e5c72fb
```

---

## ✅ Преимущества Supabase Storage:

1. **CDN** - Быстрая загрузка по всему миру
2. **Scalable** - Миллионы изображений без проблем
3. **Secure** - RLS политики для приватных файлов
4. **Free Tier** - 1 GB storage + 2 GB bandwidth
5. **No Git bloat** - Репозиторий остается легким
6. **Dynamic uploads** - Пользователи загружают свои изображения

---

## 🧪 Тестирование:

### **1. Открой демо-страницу:**
```
http://localhost:5173/#/image-storage-demo
```

### **2. Попробуй:**
- ✅ Выбрать папку (logos, products, etc.)
- ✅ Загрузить изображение (drag & drop)
- ✅ Посмотреть список изображений
- ✅ Удалить изображение

### **3. Проверь в Supabase Dashboard:**
```
https://supabase.com/dashboard/project/{projectId}/storage/buckets/katia-images
```

---

## 🎯 Next Steps:

1. **Migrate existing images:**
   - Замени все локальные изображения на Supabase URLs
   - Обнови salon.logoUrl, product.imageUrl, etc.

2. **Update forms:**
   - Добавь ImageUploader в форму создания салона
   - Добавь ImageUploader в форму добавления продукта
   - Добавь ImageUploader для аватара пользователя

3. **Replace old images:**
   - Найди все `<img src="/public/...">` 
   - Замени на `<SupabaseImage src={supabaseUrl} />`

---

## 📚 Документация:

Полная документация: `/docs/SUPABASE_STORAGE.md`

Включает:
- API Reference
- Best Practices
- Migration Guide
- Troubleshooting
- Security & Access

---

## 💡 Пример миграции:

### **Было (локальные изображения):**
```tsx
<img src="/images/salon-logo.png" alt="Salon" />
```

### **Стало (Supabase Storage):**
```tsx
// 1. Загрузили изображение через ImageUploader
const logoUrl = "https://xxx.supabase.co/storage/v1/object/public/katia-images/logos/123.png";

// 2. Сохранили URL в database
await kv.set(`salon:${id}`, { ...salon, logoUrl });

// 3. Отображаем через SupabaseImage
<SupabaseImage 
  src={salon.logoUrl} 
  alt={salon.name}
  className="w-20 h-20 rounded-full"
/>
```

---

**Created:** 25.12.2024  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production
