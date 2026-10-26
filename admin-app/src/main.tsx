import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/Toast.tsx'
import { ContentProvider } from '@/lib/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ContentProvider>
  </StrictMode>,
)
