import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cream-bg': '#FEECCE',
        'light-orange': '#F7B267',
        'deep-coral': '#F4845F',
        'peach-orange': '#F79D65',
        'warm-orange': '#F25C54',
      },
      fontWeight: {
        // ... 기존 설정 유지
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%) translateX(-50%)', opacity: 0 },
          '100%': { transform: 'translateY(0) translateX(-50%)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(0) translateX(-50%)', opacity: 1 },
          '100%': { transform: 'translateY(-100%) translateX(-50%)', opacity: 0 },
        },
        marquee: {
          '0%, 5%': { transform: 'translateX(0)' },
          '95%, 100%': { transform: 'translateX(-100%)' },
        },
        // 카운트다운 애니메이션 추가
        countdownFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      },
      animation: {
        slideDown: 'slideDown 0.3s ease-out forwards',
        slideUp: 'slideUp 0.3s ease-out forwards',
        marquee: 'marquee 8s linear infinite',
        // 카운트다운 애니메이션 추가
        countdownFadeIn: 'countdownFadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [daisyui],
};
