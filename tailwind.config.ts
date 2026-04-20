import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: "#1a1a1a",
          panel: "#252525",
          panelHeader: "#2d2d2d",
          toolbar: "#2a2a2a",
          menubar: "#323232",
          optbar: "#3a3a3a",
          canvas: "#404040",
          hover: "#3e3e3e",
          active: "#4a90d9",
          border: "#111111",
          borderLight: "#3a3a3a",
          textPrimary: "#e0e0e0",
          textMuted: "#888888",
        },
      },
    },
  },
  plugins: [],
};

export default config;
