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
    sourcemap: process.env.NODE_ENV !== 'production',
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
  },
  optimizeDeps: {
    force: true
  },
  // Improve performance on Replit
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});