import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Methodology from './pages/Methodology.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/metodologia" element={<Methodology />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
