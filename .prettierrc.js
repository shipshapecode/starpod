/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  arrowParens: 'always',
  astroAllowShorthand: false,
  proseWrap: 'always',
  trailingComma: 'none',
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
