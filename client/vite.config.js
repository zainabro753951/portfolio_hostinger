import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],

  base: "/", // 👈 IMPORTANT

  // DEV only
  server:
    mode === "development"
      ? {
          host: "0.0.0.0",
          port: 5173,
          proxy: {
            "/api": {
              target: "http://localhost:5000",
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
