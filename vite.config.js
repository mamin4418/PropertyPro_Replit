
// This file is used by Vite directly, ensuring all hosts are properly allowed
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: '0.0.0.0',
    hmr: {
      host: 'e0033227-daf3-45d2-a781-e5c7d237cf96-00-3uegealjevmva.kirk.replit.dev',
      clientPort: 443,
      protocol: 'wss'
    },
    watch: {
      usePolling: true
    },
    cors: true,
    allowedHosts: ['e0033227-daf3-45d2-a781-e5c7d237cf96-00-3uegealjevmva.kirk.replit.dev', '.replit.dev', 'localhost']
  }
});
