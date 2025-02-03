import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homaepage from './homepage.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Homaepage/>
  </StrictMode>,
)
