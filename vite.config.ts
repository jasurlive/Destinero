import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 2020,
    open: true,
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
