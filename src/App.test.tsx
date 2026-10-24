import { describe, it, expect, beforeAll } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

describe('App (smoke)', () => {
  it('muestra el mapa, la leyenda y el resumen llano al elegir un país', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    await act(async () => {
      root.render(
        <MemoryRouter>
          <App />
        </MemoryRouter>,
      )
    })

    expect(container.textContent).toContain('UBI World')
    expect(container.textContent).toContain('Se podría pagar hoy')
    expect(container.textContent).toContain('Sin datos suficientes')

    const svg = container.querySelector('svg.map-svg')
    expect(svg).not.toBeNull()
    expect(svg!.querySelector('pattern#tex-1')).not.toBeNull()

    const paths = Array.from(container.querySelectorAll('path.country'))
    expect(paths.length).toBeGreaterThan(150)

    const fills = new Set(paths.map((path) => path.getAttribute('fill')).filter(Boolean))
    expect(fills.size).toBeGreaterThan(1)

    // En modo Sencillo solo hay dos sliders y no aparece el de IA.
    expect(container.querySelector('#simple-amount')).not.toBeNull()
    expect(container.querySelector('#ai-growth')).toBeNull()

    const clickable = paths.find(
      (path) => path.getAttribute('data-iso3') && path.getAttribute('fill') !== '#9ca3af',
    )
    expect(clickable).toBeDefined()

    await act(async () => {
      clickable!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.textContent).toContain('cada 100')
    expect(container.textContent).toContain('Los números por dentro')
    expect(document.title).toContain('UBI World')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})
