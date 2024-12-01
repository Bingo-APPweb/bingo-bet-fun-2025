// src/config/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { PROXY_CONFIG } from './proxy.config';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    cors: true,
    proxy: {
      '/youtube-api': PROXY_CONFIG.youtube
    }
  },
  define: {
    'process.env': {
      VITE_YOUTUBE_API_KEY: JSON.stringify(process.env.VITE_YOUTUBE_API_KEY),
      VITE_CHANNEL_ID: JSON.stringify(process.env.VITE_CHANNEL_ID)
    }
  }
});