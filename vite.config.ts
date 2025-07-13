import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true
  },
  define: {
    'process.env.REACT_APP_OPENAI_API_KEY': JSON.stringify(process.env.REACT_APP_OPENAI_API_KEY)
  }
})