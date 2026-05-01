/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        border: 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      },
      boxShadow: {
        glow: '0 8px 32px rgba(99,102,241,0.35)',
      },
      backdropBlur: { xs: '2px' },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
