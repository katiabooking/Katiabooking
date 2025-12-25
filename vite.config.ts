import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ВАЖНО: Для GitHub Pages - замените 'repo-name' на имя вашего репозитория
  // Например, если репозиторий github.com/username/katia-booking, то base: '/katia-booking/'
  // Если используете custom domain (example.com), установите base: '/'
  base: './',
  
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Убеждаемся что public файлы копируются корректно
  publicDir: 'public',
  build: {
    // Копируем service worker и другие статические файлы
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    }
  }
})