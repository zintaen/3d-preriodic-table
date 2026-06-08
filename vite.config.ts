import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pubchem': {
        target: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pubchem/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})
