/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./blog/**/*.html",
    "./scripts/post-template.html",
    "./js/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#faf8f3',
          dark: '#14130f',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1c1b16',
        },
        ink: {
          DEFAULT: '#1a1a17',
          dark: '#e8e6df',
        },
        muted: {
          DEFAULT: '#5a5a52',
          dark: '#9a978d',
        },
        line: {
          DEFAULT: '#e8e4dc',
          dark: '#2d2b24',
        },
        accent: {
          DEFAULT: '#1e3a5f',
          dark: '#8eb5e8',
        },
      },
      maxWidth: {
        prose: '720px',
        container: '1100px',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
};
