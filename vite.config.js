import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Em dev, encaminha as chamadas /api para o Express (porta 3001),
    // evitando CORS no navegador.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
