import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/F1_website_Portfolio/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // This exposes your dev server to the local network IP
  }
})

