import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        react(),
        electron({
            entry: path.join(__dirname, 'electron/main.ts'),
            preload: {
                input: path.join(__dirname, 'electron/preload.ts'),
            },
        }),
        renderer(),
    ],
    optimizeDeps: {
        exclude: ['lucide-react']
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js'
            },
        },
    },
    base: './',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        }
    },
    server: {
        port: 3000, // Add this line to specify the desired port (e.g., 3000)
        strictPort: true, // Optional: Throw an error if the port is already in use
    }
});