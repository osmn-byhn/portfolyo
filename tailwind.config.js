/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        scp: {
          bg: "var(--scp-bg)",
          surface: "var(--scp-surface)",
          "surface-2": "var(--scp-surface-2)",
          "surface-3": "var(--scp-surface-3)",
          border: "var(--scp-border)",
          "border-strong": "var(--scp-border-strong)",
          text: "var(--scp-text)",
          muted: "var(--scp-muted)",
          faint: "var(--scp-faint)",
          primary: "var(--scp-primary)",
          "primary-hover": "var(--scp-primary-hover)",
          "primary-muted": "var(--scp-primary-muted)",
          success: "var(--scp-success)",
          warning: "var(--scp-warning)",
          danger: "var(--scp-danger)",
          accent: "var(--scp-accent)",
          paper: "var(--scp-paper)",
          ink: "var(--scp-ink)",
        },
      },
      fontFamily: {
        sans: ['"Outfit"', "system-ui", "sans-serif"],
        serif: ['"Noto Serif JP"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        scp: "0px",
      },
      boxShadow: {
        scp: "none",
        "scp-glow": "none",
      },
    },
  },
  plugins: [],
};
