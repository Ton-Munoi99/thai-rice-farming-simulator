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
          bg: "#f3f1ea",
          panel: "#fffdf7",
          border: "#dedbd0",
          card: "#ebe7dc",
          green: "#3f6f58",
          dark: "#2f5d50",
          mid: "#6f8f6a",
          amber: "#c6a15b",
          gold: "#b78a3a",
          red: "#a65a46",
          blue: "#557f92",
          text: "#2f3630",
          muted: "#657066",
          faint: "#99968c",
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(47,54,48,.08)",
        float: "0 6px 18px rgba(47,54,48,.14)",
        modal: "0 24px 70px rgba(47,54,48,.26)",
      },
    },
  },
  plugins: [],
};
