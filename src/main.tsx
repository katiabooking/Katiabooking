import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from './app/App';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import './styles/index.css';

console.log('🚀 Katia Platform is starting...');

// Проверка и исправление URL для HashRouter в production
if (!window.location.hash && window.location.pathname !== '/') {
  const path = window.location.pathname + window.location.search;
  window.location.replace('#' + path);
}

// КРИТИЧНО: Figma Make использует 'container' вместо 'root' в production
const rootElement = document.getElementById('root') || document.getElementById('container');

if (!rootElement) {
  console.error('❌ No root element found!');
  throw new Error('Root element not found');
}

console.log('✅ Root element found:', rootElement.id);
console.log('📍 Location:', window.location.href);

// FIX: Сохраняем root instance для переиспользования
// Предотвращает "createRoot() called twice" warning
declare global {
  interface Window {
    __REACT_ROOT__?: Root;
    __REACT_ROOT_CONTAINER__?: HTMLElement;
  }
}

// ИСПРАВЛЕНИЕ: StrictMode только в development
// В production StrictMode может вызывать double render warnings
const isDevelopment = import.meta.env.DEV;

const appComponent = isDevelopment ? (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
) : (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// ИСПРАВЛЕНИЕ: Проверяем что root не был создан ранее ИЛИ контейнер изменился
// Это предотвращает React Double Render warning в dev и HMR
if (!window.__REACT_ROOT__ || window.__REACT_ROOT_CONTAINER__ !== rootElement) {
  console.log('✅ Creating new React root');
  
  // Cleanup old root if exists
  if (window.__REACT_ROOT__) {
    console.log('🔄 Unmounting old root');
    try {
      window.__REACT_ROOT__.unmount();
    } catch (e) {
      console.warn('⚠️ Could not unmount old root:', e);
    }
  }
  
  window.__REACT_ROOT__ = createRoot(rootElement);
  window.__REACT_ROOT_CONTAINER__ = rootElement;
  window.__REACT_ROOT__.render(appComponent);
  console.log('✅ App rendered successfully');
} else {
  console.log('ℹ️ Reusing existing React root');
  window.__REACT_ROOT__.render(appComponent);
}

// HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    console.log('🔥 HMR: Cleaning up old root');
    if (window.__REACT_ROOT__) {
      try {
        window.__REACT_ROOT__.unmount();
      } catch (e) {
        console.warn('⚠️ HMR cleanup error:', e);
      }
      window.__REACT_ROOT__ = undefined;
      window.__REACT_ROOT_CONTAINER__ = undefined;
    }
  });
}