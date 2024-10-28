import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'My PWA App',
        short_name: 'PWA App',
        description: 'A simple PWA using Vite, React, and TypeScript',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/favicon/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/favicon/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/favicon/apple-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icons/favicon/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'icons/favicon/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'icons/favicon/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'icons/favicon/ms-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
