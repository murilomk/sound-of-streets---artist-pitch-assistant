import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'capacitor-cli.d.ts': path.resolve(__dirname, 'node_modules/@capgo/capacitor-updater/dist/esm/index.js'), // Hack para evitar erro de resolução
    }
  },
  optimizeDeps: {
    exclude: ['@capgo/capacitor-updater']
  },
  build: {
    rollupOptions: {
      external: ['capacitor-cli.d.ts']
    }
  }
});

