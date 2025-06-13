/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          "vendor-react": ["react", "react-dom"],
          "vendor-radix": [
            "@radix-ui/react-toast",
            "@radix-ui/react-switch",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-select",
          ],

          "vendor-icons": ["lucide-react"],
          "vendor-dnd": ["react-beautiful-dnd"],
          "vendor-utils": [
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  // Vitest configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts", // Optional: if you have a setup file
    css: true, // if you want to test components with CSS
  },
});
