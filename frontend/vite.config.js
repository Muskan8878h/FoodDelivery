import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),],
  server: {
    host: "127.0.0.1", // force IPv4 instead of ::1 (IPv6)
    port: 3000         // change port from 5173 → 3000
  }
  
})
