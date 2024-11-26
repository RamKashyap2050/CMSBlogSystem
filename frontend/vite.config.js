import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "http://localhost:3045",
        changeOrigin: true,
      },
      "/admin/api": {
        target: "http://localhost:3045",
        changeOrigin: true,
      },
    },
    historyApiFallback: true, // Ensure Vite falls back to index.html for unknown routes
  },
});
