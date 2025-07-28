module.exports = {
    darkMode: 'class',
    content: [
      './app/**/*.{js,ts,jsx,tsx}',      // App Router
      './pages/**/*.{js,ts,jsx,tsx}',    // Legacy Pages
      './components/**/*.{js,ts,jsx,tsx}',
      './src/**/*.{js,ts,jsx,tsx}',      // If you're nesting everything inside /src
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  