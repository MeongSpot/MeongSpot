import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Vite config
    plugins: [
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
      inject: {
        data: {
          VITE_KAKAO_MAP_API_KEY: process.env.VITE_KAKAO_MAP_API_KEY
        }
      }
    }),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false,
        },
        manifest: {
          name: '멍스팟',
          short_name: '멍스팟',
          description: '위치기반 반려견 산책 기록 및 친구 만들기 서비스',
          theme_color: '#FEECCE',
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
    define: {
      // 여기서 환경변수를 전역적으로 정의
      'process.env': env,
      // Vite의 env 변수도 정의
      'import.meta.env': JSON.stringify(env),
    },
  };
});
