import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router/AppRouter.jsx'

console.log('=== App Starting ===');

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1 style="color: red; padding: 2rem;">ERROR: Root element not found!</h1>';
} else {
  try {
    console.log('Creating React root...');
    const root = createRoot(rootElement);
    console.log('Rendering App...');
    root.render(
      <StrictMode>
        <AppRouter />
      </StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Critical error:', error);
    console.error('Stack:', error.stack);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #fff; font-family: Arial; padding: 2rem;">
        <div style="text-align: center; background: #1e293b; padding: 2rem; border-radius: 0.5rem; border: 2px solid #ef4444;">
          <h1 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Error Loading Application</h1>
          <p style="font-size: 1.1rem; margin-bottom: 1rem;">${error.message}</p>
          <pre style="background: #0f172a; padding: 1rem; border-radius: 0.375rem; text-align: left; overflow-x: auto; max-width: 500px; font-size: 0.85rem;">${error.stack}</pre>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #14b8a6; color: #fff; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600; font-size: 1rem;">Retry</button>
        </div>
      </div>
    `;
  }
}
