import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
          "radix-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu", 
            "@radix-ui/react-select",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-separator"
          ],
          "utils-vendor": ["axios", "clsx", "tailwind-merge", "class-variance-authority"],
          "icons-vendor": ["lucide-react"]
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase to 1000kB
    minify: "esbuild",
    target: "esnext"
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios"],
    exclude: ["lucide-react"]
  }
});