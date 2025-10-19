import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/shopbags/', // 👈 Mets ici le nom EXACT de ton dépôt GitHub
})
