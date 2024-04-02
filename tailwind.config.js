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
      },
      boxShadow: {
        "cat-default": "0px 5px 5px 0px rgba(0, 0, 0, 0.25)",
      }
    },
  },
  darkMode: "class",
  plugins: [],
}
