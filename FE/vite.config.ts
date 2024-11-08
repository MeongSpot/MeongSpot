import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }) => {
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
              src: '/icons/favicon/android-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            // ... 나머지 아이콘 설정
          ],
        },
        injectRegister: 'auto',
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
    assetsInclude: ['**/*.svg'], // SVG 파일 포함
    server: {
      proxy: {
        '/api': {
          target: 'https://meongspot.kro.kr',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              // 필수 헤더만 설정하고 로그는 제거
              proxyReq.setHeader('Origin', 'https://meongspot.kro.kr');
              proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
              proxyReq.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
            });
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      assetsDir: 'assets',
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
          assetFileNames: (assetInfo) => {
            if (assetInfo && assetInfo.names && assetInfo.names.length > 0) {
              const fileName = assetInfo.names[0];
              if (fileName.endsWith('.svg')) {
                return 'assets/svg/[name]-[hash][extname]';
              }
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
    esbuild: {
      drop: command === 'build' ? ['console', 'debugger'] : [],
    },
  };
});
