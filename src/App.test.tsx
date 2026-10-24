import { describe, it, expect, beforeAll } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

describe('App (smoke)', () => {
  it('renderiza la cabecera y pinta los países del mapa', async () => {
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
    expect(container.querySelector('svg.map-svg')).not.toBeNull()

    const paths = container.querySelectorAll('path.country')
    expect(paths.length).toBeGreaterThan(150)

    const fills = new Set(
      Array.from(paths).map((p) => p.getAttribute('fill')).filter(Boolean),
    )
    expect(fills.size).toBeGreaterThan(1)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})
