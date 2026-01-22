/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#373F51',      // Charcoal (Text/Backgrounds)
        primary: '#008DD5',   // Blue (Buttons/Links)
        light: '#DFBBB1',     // Soft Pink/Beige (Background accents)
        accent: '#F56476',    // Salmon (Highlights)
        danger: '#E43F6F',    // Deep Pink (Delete/Errors)
      }
    },
  },
  plugins: [],
}