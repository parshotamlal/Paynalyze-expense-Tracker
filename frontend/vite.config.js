import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "production" && removeConsole()].filter(Boolean),
  server: {
    host: true,
    strictPort: true,
    proxy: {
      "/api/v1": {
        target: "https://paynalyze-expense-tracker.onrender.com",
        changeOrigin: true,
      },
    },
  },
}));

