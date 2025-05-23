/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  // Vitest configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts", // Optional: if you have a setup file
    css: true, // if you want to test components with CSS
  },
});
