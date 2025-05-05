// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client', // Set the root to the client directory where index.html is located
  build: {
    outDir: '../dist', // Output the build files to the root-level dist directory
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
    // Note: allowedHosts is not a valid Vite option; use hmr.host or other CORS settings instead
  },
});