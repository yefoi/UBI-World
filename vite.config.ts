import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawSiteUrl =
    env.VITE_SITE_URL ||
    env.VERCEL_PROJECT_PRODUCTION_URL ||
    env.VERCEL_URL ||
    'https://ubi-world.vercel.app'
  const siteUrl = (rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`).replace(
    /\/$/,
    '',
  )

  return {
    plugins: [
      react(),
      {
        name: 'html-site-url',
        transformIndexHtml(html: string) {
          return html.replaceAll('__SITE_URL__', siteUrl)
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return
            if (
              id.includes('world-atlas') ||
              id.includes('d3-geo') ||
              id.includes('d3-array') ||
              id.includes('topojson-client')
            ) {
              return 'map'
            }
            if (id.includes('react-router')) return 'router'
            if (id.includes('react')) return 'react'
          },
        },
      },
    },
  }
})
