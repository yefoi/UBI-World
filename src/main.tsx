import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const Methodology = lazy(() => import('./pages/Methodology.tsx'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="route-loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <span className="sr-only">Cargando… / Loading…</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/metodologia" element={<Methodology />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
