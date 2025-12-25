import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from './app/App';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import { suppressKnownWarnings } from './utils/suppressWarnings';
import './styles/index.css';

// Подавляем известные React warnings в dev режиме
suppressKnownWarnings();

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

// FIX: Глобальные типы для React root instance
declare global {
  interface Window {
    __REACT_ROOT__?: Root;
    __REACT_ROOT_CONTAINER__?: HTMLElement;
  }
}

// ИСПРАВЛЕНИЕ: StrictMode только в development
// В production StrictMode может вызывать performance issues
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

// ИСПРАВЛЕНИЕ: Полная защита от double createRoot
// Проверяем что root не создан ИЛИ контейнер изменился
const needsNewRoot =
  !window.__REACT_ROOT__ ||
  window.__REACT_ROOT_CONTAINER__ !== rootElement ||
  !rootElement.hasChildNodes(); // Дополнительная проверка

if (needsNewRoot) {
  console.log('✅ Creating new React root');

  // Cleanup старого root если существует
  if (window.__REACT_ROOT__) {
    console.log('🔄 Unmounting old root');
    try {
      window.__REACT_ROOT__.unmount();
    } catch (e) {
      console.warn('⚠️ Could not unmount old root:', e);
    }
  }

  // Очистка container перед созданием нового root
  // Это предотвращает React warning
  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }

  window.__REACT_ROOT__ = createRoot(rootElement);
  window.__REACT_ROOT_CONTAINER__ = rootElement;
  window.__REACT_ROOT__.render(appComponent);
  console.log('✅ App rendered successfully');
} else {
  console.log('ℹ️ Reusing existing React root (HMR update)');
  window.__REACT_ROOT__.render(appComponent);
}

// HMR cleanup для dev mode
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    console.log('🔥 HMR: Cleaning up for hot reload');
    // НЕ unmount root при HMR, только при полной перезагрузке
    // Это предотвращает flickering и warnings
  });

  // Accept HMR updates
  import.meta.hot.accept();
}