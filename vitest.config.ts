import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Плагин для обработки Figma assets
function figmaAssetsPlugin(): any {
  const virtualModulePrefix = '\0figma:asset/';
  
  return {
    name: 'vite-plugin-figma-assets',
    enforce: 'pre' as const,
    
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return virtualModulePrefix + id.slice('figma:asset/'.length);
      }
    },
    
    load(id: string) {
      if (id.startsWith(virtualModulePrefix)) {
        // Возвращаем пустую data URL картинку 1x1 пиксель
        return `export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="`;
      }
    },
  };
}

export default defineConfig({
  base: '/Katiabooking/',
  
  plugins: [
    figmaAssetsPlugin(),
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