import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Katiabooking/',
  
  plugins: [
    react(),
    tailwindcss(),
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
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  },
})