/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}", // El asterisco doble (**) busca en todas las subcarpetas como /lib
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}