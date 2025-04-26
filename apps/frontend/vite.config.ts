import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  logLevel: "info",
  server: {
    port: 5173, // Ensure this is set
    open: true, // Automatically open browser (optional, for testing)
  },
});
