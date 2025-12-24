import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ВАЖНО: Для GitHub Pages
  base: './',
  
  plugins: [
    react(),
    tailwindcss(),
    // Плагин для обработки Figma assets
    {
      name: 'figma-assets',
      resolveId(id) {
        if (id.startsWith('figma:asset/')) {
          // Преобразуем figma:asset/... в путь к assets
          const fileName = id.replace('figma:asset/', '')
          return path.resolve(__dirname, `./src/assets/${fileName}`)
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    }
  }
})