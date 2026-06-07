import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
process.env.FORCE_COLOR = '0';
process.env.NO_COLOR = '1';
export default defineConfig({
    base: '/admin/',
    build: {
        sourcemap: 'hidden',
        outDir: '../dist/admin',
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
});
