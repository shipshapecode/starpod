/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,svg,ts,tsx,vue}'],
  theme: {
    extend: {
      backgroundImage: {
        'dots-dark': "url('/images/dots-dark.svg')",
        'dots-light': "url('/images/dots-light.svg')",
        'gradient-light':
          'background: radial-gradient(77% 77% at 50% 0%, #EDECFC 0%, rgba(237, 236, 252, 0) 100%)',
        'gradient-dark':
          'radial-gradient(77% 77% at 50% 0%, #586984 0%, rgba(88, 105, 132, 0) 100%)'
      },
      colors: {
        'dark-background': 'oklch(13.85% 0.025 273.24 / <alpha-value>)',
        'dark-border': 'oklch(23.8% 0.04 266.76 / <alpha-value>)',
        'dark-button': 'oklch(21.57% 0.029 280.68 / <alpha-value>)',
        'dark-card': 'oklch(18.74% 0.024 280.08 / <alpha-value>)',
        'dark-icon': 'oklch(71.44% 0.019 264.45 / <alpha-value>)',
        'dark-input-bg': 'oklch(21.63% 0.031 280.68 / <alpha-value>)',
        'dark-input-border': 'oklch(28.08% 0.048 281.19 / <alpha-value>)',
        'dark-input-border-focused':
          'oklch(45.84% 0.078 281.04 / <alpha-value>)',
        'dark-player': 'oklch(22.61% 0.035 280.78 / <alpha-value>)',
        'dark-text-body': 'oklch(61.91% 0.019 264.42 / <alpha-value>)',

        'light-card': 'oklch(97.65% 0.005 274.97 / <alpha-value>)',
        'light-icon': 'oklch(67.65% 0.043 285.21 / <alpha-value>)',
        'light-input-bg': 'oklch(100% 0 0 / <alpha-value>)',
        'light-input-border': 'oklch(88.09% 0.018 234.53 / <alpha-value>)',
        'light-input-border-focused':
          'oklch(57.79% 0.03 234.37 / <alpha-value>)',
        'light-player': 'oklch(95.94% 0.009 279.69 / <alpha-value>)',
        'light-text-body': 'oklch(59.68% 0.017 285.89 / <alpha-value>)',
        'light-text-heading': 'oklch(30.55% 0.052 292.57 / <alpha-value>)'
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
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography')
  ]
};
