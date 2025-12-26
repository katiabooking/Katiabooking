import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Плагин для обработки Figma assets
function figmaAssetsPlugin(): any {
  return {
    name: 'vite-plugin-figma-assets',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return id;
      }
    },
    load(id: string) {
      if (id.startsWith('figma:asset/')) {
        return 'export default ""';
      }
    },
  };
}

export default defineConfig({
  base: '/Katiabooking/',
  
  plugins: [
    react(),
    tailwindcss(),
    figmaAssetsPlugin(),
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