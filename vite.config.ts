// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client', // Explicitly set the root to the client directory
  plugins: [react()], // Add React plugin for TypeScript/JSX support
  build: {
    outDir: '../dist', // Output to root-level dist directory
    emptyOutDir: true, // Clear the dist directory before building
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    watch: {
      usePolling: true,
    },
    cors: true,
  },
  // Add logging for debugging
  logLevel: 'info',
});