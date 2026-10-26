import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

process.env.FORCE_COLOR = '0'
process.env.NO_COLOR = '1'

export default defineConfig({
  // 后台作为独立站点部署在根路径（与主站分开的 EdgeOne 项目）
  base: '/',
  build: {
    sourcemap: 'hidden',
    outDir: './dist',
  },
  server: {
    port: 5174,
    strictPort: false,
  },
  logLevel: 'info',
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
