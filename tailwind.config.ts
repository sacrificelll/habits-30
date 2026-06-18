import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        smoky: "#100C0B",
        night: "#171614",
        eerie: "#1C1B17",
        "eerie-light": "#282723",
        "hot-orange": "#EB4604",
        "orange-wheel": "#F77E0D",
        moss: "#99A57D",
        cream: "#F5F3F0",
        fog: "#8A857C",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
