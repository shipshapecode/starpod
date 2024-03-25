/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(13.85% 0.025 273.24 / <alpha-value>)',
        border: 'oklch(23.8% 0.04 266.76 / <alpha-value>)',
        button: 'oklch(28.08% 0.048 281.19 / <alpha-value>)',
        card: 'oklch(18.74% 0.024 280.08 / <alpha-value>)',
        player: 'oklch(22.61% 0.035 280.78 / <alpha-value>)',
        'text-body': 'oklch(61.91% 0.019 264.42 / <alpha-value>)'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem'
      }
    }
  },
  plugins: [require('tailwindcss-oklch')()]
};
