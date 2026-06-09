import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// 禁用颜色输出以解决 Windows 终端乱码问题
process.env.FORCE_COLOR = '0'
process.env.NO_COLOR = '1'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  server: {
    port: 5173,
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
