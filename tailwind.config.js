import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        scp: {
          bg: "#080909",
          surface: "#101212",
          "surface-2": "#151818",
          "surface-3": "#1a1e1e",
          border: "#292d2d",
          "border-strong": "#3a4040",
          text: "#d6d6d6",
          muted: "#777777",
          faint: "#555555",
          primary: "#9f1d20",
          "primary-hover": "#c0262a",
          "primary-muted": "#6b1618",
          success: "#4f7658",
          warning: "#a47c32",
          danger: "#8f1d1d",
          accent: "#b83a3a",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        scp: "2px",
      },
      boxShadow: {
        scp: "inset 0 1px 0 0 rgba(255,255,255,0.03)",
        "scp-glow": "0 0 40px -12px rgba(159, 29, 32, 0.35)",
      },
      backgroundImage: {
        "scp-grid":
          "linear-gradient(rgba(41,45,45,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(41,45,45,0.35) 1px, transparent 1px)",
      },
      backgroundSize: {
        "scp-grid": "48px 48px",
      },
      keyframes: {
        "status-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "status-pulse": "status-pulse 2.4s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
