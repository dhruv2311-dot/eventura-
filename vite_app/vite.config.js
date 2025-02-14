import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts:[
      '626e-2409-40c1-5004-8229-4d80-515c-5805-2e9.ngrok-free.app'
    ]
  }
})
