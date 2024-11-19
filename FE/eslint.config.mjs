import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  tseslint.configs.recommended, // TypeScript ESLint 플러그인 설정
  pluginJs.configs.recommended, // 기본 JavaScript ESLint 설정
  react.configs.flat.recommended, // React ESLint 설정
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        kakao: 'readonly', // kakao 전역변수 추가
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // TypeScript 설정 경로 명시
      },
    },
    plugins: {
      '@typescript-eslint': tseslint, // TypeScript ESLint 플러그인
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-unused-vars': 'off', // TypeScript의 사용하지 않는 변수 무시
      'no-unused-vars': 'off', // 일반 JavaScript의 사용하지 않는 변수 무시
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-vars': 'error', // JSX 내부에서 변수 사용 여부 확인
      'no-undef': 'error', // undefined 변수 사용 체크
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
