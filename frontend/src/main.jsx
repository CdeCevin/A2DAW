import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AlertProvider } from './store/alert-context.jsx'
import AuthContextProvider from './store/auth-context.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <AlertProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AlertProvider>
  </AuthContextProvider>,
)
