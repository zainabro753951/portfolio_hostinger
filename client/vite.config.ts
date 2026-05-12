// vite.config.js
import react from '@vitejs/plugin-react';
import { inspectAttr } from 'kimi-plugin-inspect-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite'; // ✅ loadEnv import karein

export default defineConfig(({ mode }) => {
  // ✅ Environment variables load karein
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [inspectAttr(), react()],
    server: {
      proxy: {
        '/api': {
          // ✅ process.env ya loadEnv se access karein
          target: env.VITE_BACKEND_GEN_URI || 'http://localhost:3000', // ✅ Fallback bhi add karein
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
