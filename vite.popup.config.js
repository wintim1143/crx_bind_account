import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { CRX_OUTDIR } from './globalConfig'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: CRX_OUTDIR,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
})
