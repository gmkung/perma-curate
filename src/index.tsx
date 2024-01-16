import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import Modal from 'react-modal'
import { HashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

declare global {
  interface Window {
    ethereum?: any
  }
}

const container = document.getElementById('app')
Modal.setAppElement(container!)
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <ToastContainer theme="colored" />
    </HashRouter>
  </React.StrictMode>
)
