/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        "con-screen-0": "1060px",
        "con-screen-1": "1550px",
        "con-screen-2": "2025px",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "cat-blue-dark-0": "#305B73",
        "cat-blue-dark-1": "#1f2937",
        "cat-gray-0": "#94b3c7bf",
        "cat-gray-1": "#94B3C7",

        "header-text-0": "#092C48",
        "dark-header-text-0": "#EEEEEE",
        "panel-gradient-0": "#ca8076",
        "panel-gradient-1": "#9d5850",
        "background-gradient-0": "#FFFFFF",
        "dark-background-gradient-0": "#31363F",
        "background-gradient-1": "#e5e5ff",
        "dark-background-gradient-1": "#222831",

        "navbar-body-0": "#5D6E9E",
        "dark-navbar-body-0": "#111720",
        "navbar-body-1": "#e5e5ff",
        "dark-navbar-body-1": "#e5e5ff",
        "navbar-body-2": "#5D6E9E",
        "dark-navbar-body-2": "#7b5451",

        "text-header-0": "#374151",
        
      },
      boxShadow: {
        "cat-default": "0px 5px 5px 0px rgba(0, 0, 0, 0.25)",
      }
    },
  },
  darkMode: "class",
  plugins: [],
}