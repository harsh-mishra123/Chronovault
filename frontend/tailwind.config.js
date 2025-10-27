/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vaultBlue: '#00CFFF',
        vaultPurple: '#8B5CF6',
        vaultGray: '#1F1F1F',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      dropShadow: {
        'glow': '0 0 10px rgba(0, 207, 255, 0.7)',
      },
    },
  },
  plugins: [],
}

