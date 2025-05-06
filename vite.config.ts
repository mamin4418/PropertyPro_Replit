// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client', // Explicitly set the root to the client directory
  plugins: [react()], // Add React plugin for TypeScript/JSX support
  build: {
    outDir: 'dist', // Output to client/dist directory
    emptyOutDir: true, // Clear the dist directory before building
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      host: 'e0033227-daf3-45d2-a781-e5c7d237cf96-00-3uegealjevmva.kirk.replit.dev',
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
