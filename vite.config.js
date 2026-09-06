import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// carimbo do build, para dar para saber na tela qual versão está no ar
const CARIMBO = new Date().toISOString().slice(5, 16).replace('T', ' ')

export default defineConfig({
  plugins: [react()],
  define: { __BUILD__: JSON.stringify(CARIMBO) },
  server: { port: 5274 },
  build: {
    // tudo vira data URI e um CSS só, para o build caber em um arquivo HTML
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
})
