
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    // Optimize for Replit deployment
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter'],
          ui: [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            'class-variance-authority',
            'clsx'
          ]
        }
      }
    }
  }
});
