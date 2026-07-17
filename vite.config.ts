import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /pj-university-chooser/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/pj-university-chooser/' : '/',
})
