import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cream-bg': '#FEECCE', // 크림색 배경
        'light-orange': '#F7B267', // 밝은 주황색
        'deep-coral': '#F4845F', // 진한 코랄
        'peach-orange': '#F79D65', // 복숭아 주황
        'warm-orange': '#F79D65', // 따뜻한 주황
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    },
  },
  plugins: [daisyui],
};
