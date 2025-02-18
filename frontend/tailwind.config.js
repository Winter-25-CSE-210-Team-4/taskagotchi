// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          "nanum": ["Nanum Brush Script", 'serif'],
          "inter": ["Inter", 'serif']
        }

      },
    },
    daisyui: {
      themes: [
        {
          mytheme: {
            "primary": "#4ECDC4", //mint
            "accent": "#1A535C", //darkmint
            "secondary": "#B9FAED", //lightmint
            "neutral": "#FFE66D" //yellow
          }
        }
      ]
    },
    plugins: [require('daisyui')],
  };