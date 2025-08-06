import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['26afa0291245.ngrok-free.app'],
    proxy: {
      '/api': 'http://localhost:5000',
      '/user': 'http://localhost:5000',
      '/course': 'http://localhost:5000',
      '/cart': 'http://localhost:5000',
      '/order': 'http://localhost:5000',
    },
  },
  // Add this for SPA fallback in Vite preview/build
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  preview: {
    // This ensures fallback to index.html for client-side routes
    fallback: true,
  },
});
