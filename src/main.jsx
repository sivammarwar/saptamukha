import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { isCelebrityMatchingEnabled, loadCelebrityData } from './lib/celebrityMatcher.js'
import { preloadFaceMesh } from './lib/mediapipeFaceMesh.js'
import './styles/globals.css'
import './styles/animations.css'
import './styles/tantrik-theme.css'

async function bootstrap() {
  console.log('[App] Starting preloads...');
  
  // Start MediaPipe preload (non-blocking)
  preloadFaceMesh().then(() => {
    console.log('[App] MediaPipe fully ready in background!');
  }).catch((err) => {
    console.warn('[App] MediaPipe preload error:', err);
  });
  
  if (isCelebrityMatchingEnabled()) {
    await loadCelebrityData().then(() => {
      console.log('[App] Reference data loaded');
    }).catch((err) => {
      console.warn('[App] Reference data error:', err);
    });
  }
  
  console.log('[App] Rendering app (MediaPipe may still be loading in background)');
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap()
