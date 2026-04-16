import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // ✅ IMPORTANT FIX for Netlify + Vercel SPA routing
  base: "./",

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    host: true,
  },

  preview: {
    port: 5173,
    host: true,
  },
});