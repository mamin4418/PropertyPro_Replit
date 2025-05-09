
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // Log more info during build
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: '0.0.0.0',
    port: 3001, // Use a different port than the server to avoid conflicts
    cors: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      // Add more HMR options for better reliability in Replit
      timeout: 20000,
      overlay: true,
    },
  },
});
