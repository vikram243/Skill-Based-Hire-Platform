import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Provider } from 'react-redux'
// import store from './redux/store.js'/
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster richColors closeButton position="top-right" expand />
  </StrictMode>
)