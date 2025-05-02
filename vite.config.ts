import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1024, // Ajuste o limite conforme necessário
    outDir: 'dist'
  },
  server: {
    host: true, // Permite acesso externo
    port: 3000, // Porta padrão
    open: true, // Abre o navegador automaticamente
  },
  preview: {
    port: 3000,
    host: true
  }
})