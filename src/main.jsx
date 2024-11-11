import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

const rootElement = document.getElementById("root");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <App />
  </StrictMode>,
)

document.getElementsByClassName('loader')[0].style.display = "none";
document.getElementsByClassName('loader-container')[0].style.display = "none";
rootElement.style.display = "block";