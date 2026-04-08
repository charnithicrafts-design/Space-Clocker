import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { comlink } from 'vite-plugin-comlink';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      comlink(),
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: true,
          type: 'module'
        },
        includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'mask-icon.svg'],
        workbox: {
          maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        },
        manifest: {
          name: 'Space-Clocker',
          short_name: 'SpaceClocker',
          description: 'High-fidelity space-themed productivity and skill-tracking application',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    worker: {
      format: 'es',
      plugins: () => [comlink()],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['framer-motion', 'motion', 'lucide-react', 'clsx', 'tailwind-merge'],
            'db-vendor': ['@electric-sql/pglite'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      exclude: ['@electric-sql/pglite'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
