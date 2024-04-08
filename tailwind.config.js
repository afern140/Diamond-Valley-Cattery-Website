/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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

        "header-text-0": "#673a35",
        "dark-header-text-0": "#ea9087",
        "panel-gradient-0": "#ca8076",
        "panel-gradient-1": "#9d5850",
        "background-gradient-0": "#EBB7A6",
        "dark-background-gradient-0": "#704f43",
        "background-gradient-1": "#ca8076",
        "dark-background-gradient-1": "#ca8076",

        "navbar-body-0": "#9d5850",
        "dark-navbar-body-0": "#bc745a",
        "navbar-body-1": "#ca8076",
        "dark-navbar-body-1": "#ac7670",
        "navbar-body-2": "#000000",
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