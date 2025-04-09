import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts:["075b-2a09-bac5-3cb8-11c3-00-1c5-cb.ngrok-free.app"]
  }
})
