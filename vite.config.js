import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@fullcalendar/react', '@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/interaction'],
    include: ['@fullcalendar/core/locales/fr']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // ← remplace par l'URL de ton backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})