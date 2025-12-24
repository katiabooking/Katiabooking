import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);