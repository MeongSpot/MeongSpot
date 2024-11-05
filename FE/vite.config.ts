import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_KAKAO_MAP_API_KEY: env.VITE_KAKAO_MAP_API_KEY,
          },
        },
      }),
      VitePWA({
        manifest: {
          name: '멍스팟',
          short_name: '멍스팟',
          description: '위치기반 반려견 산책 기록 및 친구 만들기 서비스',
          theme_color: '#FEECCE',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
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
        injectRegister: null,
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          navigateFallback: null,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env': env,
    },
    publicDir: 'public',
    server: {
      headers: {
        'Service-Worker-Allowed': '/',
      },
      proxy: {
        '/api': {
          target: 'https://meongspot.kro.kr',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    esbuild: {
      drop: command === 'build' ? ['console', 'debugger'] : [],
    },
  };
});
