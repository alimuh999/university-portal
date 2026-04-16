import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/", // Netlify ke liye important

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
    outDir: "dist", // simple rakha for Netlify
    emptyOutDir: true,
  },

  server: {
    port: 5173, // default Vite port
    host: true,
  },

  preview: {
    port: 5173,
    host: true,
  },
});