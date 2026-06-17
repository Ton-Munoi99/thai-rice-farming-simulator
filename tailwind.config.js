export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans Thai", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "IBM Plex Sans Thai", "system-ui", "sans-serif"],
      },
      colors: {
        rice: {
          bg: "#eef1e8",
          panel: "#fbfcf8",
          border: "#e2e7da",
          card: "#e8ece1",
          green: "#2f8f4e",
          dark: "#1d6b39",
          mid: "#6fae3f",
          amber: "#e0a82e",
          gold: "#c8901c",
          red: "#d2603a",
          blue: "#3b9fd6",
          text: "#243027",
          muted: "#52614f",
          faint: "#90998c",
        },
      },
      boxShadow: {
        soft: "0 3px 12px rgba(0,0,0,.1)",
        float: "0 5px 18px rgba(0,0,0,.17)",
        modal: "0 24px 70px rgba(0,0,0,.4)",
      },
    },
  },
  plugins: [],
};
