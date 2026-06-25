import React from 'react'
import { createRoot } from 'react-dom/client'

// @ts-ignore
import App from '../fiyatlama-pro.tsx'

createRoot(document.getElementById('root')!).render(
  React.createElement(App)
)
