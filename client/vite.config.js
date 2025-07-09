import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['721ed95840e3.ngrok-free.app'],
    proxy: {
      '/user': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
      '/course': 'http://localhost:5000',
      '/cart': 'http://localhost:5000',
      '/order': 'http://localhost:5000',
    }
  }
});
