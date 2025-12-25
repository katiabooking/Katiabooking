/**
 * Утилита для быстрой отладки Supabase Storage через консоль браузера
 * 
 * Использование в консоли:
 * - window.checkStorageStatus() - проверить статус bucket
 * - window.initStorage() - инициализировать bucket
 * - window.openStorageAdmin() - открыть админ-панель
 * - window.openStorageDemo() - открыть демо-страницу
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb`;

/**
 * Проверить статус bucket
 */
export async function checkStorageStatus() {
  console.log('🔍 Checking storage status...');
  
  try {
    const response = await fetch(`${API_BASE}/storage/status`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.exists) {
      console.log('✅ Bucket exists!');
      console.log('📊 Stats:', {
        name: data.bucketName,
        totalImages: data.totalImages,
        public: data.bucket?.public,
      });
      
      console.log('\n📁 Folder breakdown:');
      data.folders?.forEach((folder: any) => {
        console.log(`   • ${folder.folder}: ${folder.count} images`);
      });
    } else {
      console.log('⚠️ Bucket not found!');
      console.log('💡 Run window.initStorage() to create it');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error checking storage:', error);
    throw error;
  }
}

/**
 * Инициализировать bucket
 */
export async function initStorage() {
  console.log('🚀 Initializing storage bucket...');
  
  try {
    const response = await fetch(`${API_BASE}/storage/init`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Bucket initialized successfully!');
      console.log('📦 Bucket name:', data.bucketName);
      console.log('🌐 All buckets:', data.allBuckets);
      console.log('\n💡 Now you can:');
      console.log('   1. Check status: window.checkStorageStatus()');
      console.log('   2. Open admin: window.openStorageAdmin()');
      console.log('   3. Test upload: window.openStorageDemo()');
    } else {
      console.log('⚠️ Initialization completed with warnings');
      console.log(data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
    throw error;
  }
}

/**
 * Открыть админ-панель Storage
 */
export function openStorageAdmin() {
  console.log('🔧 Opening Storage Admin Panel...');
  window.location.hash = '/storage-admin';
}

/**
 * Открыть демо-страницу Storage
 */
export function openStorageDemo() {
  console.log('🎨 Opening Storage Demo Page...');
  window.location.hash = '/image-storage-demo';
}

/**
 * Показать помощь
 */
export function storageHelp() {
  console.log('\n📦 Supabase Storage Debug Commands:\n');
  console.log('   window.checkStorageStatus()  - Check bucket status');
  console.log('   window.initStorage()         - Initialize bucket');
  console.log('   window.openStorageAdmin()    - Open admin panel');
  console.log('   window.openStorageDemo()     - Open demo page');
  console.log('   window.storageHelp()         - Show this help\n');
  console.log('📚 Documentation:');
  console.log('   • QUICK_START_STORAGE.md');
  console.log('   • STORAGE_SETUP.md');
  console.log('   • STORAGE_SYSTEM_SUMMARY.md\n');
}

// Экспортируем в window для использования в консоли
if (typeof window !== 'undefined') {
  (window as any).checkStorageStatus = checkStorageStatus;
  (window as any).initStorage = initStorage;
  (window as any).openStorageAdmin = openStorageAdmin;
  (window as any).openStorageDemo = openStorageDemo;
  (window as any).storageHelp = storageHelp;
  
  // Показываем подсказку при загрузке
  console.log('\n💡 Storage Debug Commands Available!');
  console.log('   Type "window.storageHelp()" for available commands\n');
}
