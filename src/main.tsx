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
declare global {
  interface Window {
    __REACT_ROOT__?: Root;
  }
}

const appComponent = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Используем существующий root или создаем новый
if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = createRoot(rootElement);
  console.log('✅ Creating new React root');
}

window.__REACT_ROOT__.render(appComponent);
console.log('✅ App rendered successfully');