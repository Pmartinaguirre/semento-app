import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Esto ayuda a Vite a encontrar tus archivos en cualquier servidor
  base: './', 
})