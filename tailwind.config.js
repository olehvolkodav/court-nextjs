const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./hoc/**/*.{js,ts,jsx,tsx}",
    "./theme/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        natural: {
          '3': '#F5F5F7',
          '4': '#F0F0F4',
          '6': '#C2C0CF',
          '7': '#918DA9',
          '8': '#605A83',
          '9': '#4C4674',
          '10': '#AEABBE',
          '13': '#0A0140',
          'evidence': '#00AA84',
          'milestone': '#FF0000',
          'document': '#0089FF',
          'witness': '#FF7444',
          'dark-grey': '#666666',
          'arrow-grey': '#A3A3A3'
        },
        primary: {
          1: "#6200EE",
        },
      },
      fontSize: {
        '3.3xl': '32px'
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      minHeight: {
        dashboard: 'calc(100% - 8rem)'
      },
      width: {
        '2.9/5': '49%'
      },
      spacing: {
        '15': '60px'
      },
      boxShadow: {
        select: '0px 25px 50px -12px rgba(16, 24, 40, 0.25)'
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
