import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "rgb(58 49 44 / <alpha-value>)",
        stone: {
          50: "#faf8f5",
          100: "#f3f0ea",
          200: "#ece7e0",
          300: "#ddd5cb",
          400: "#b7aa9b",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(58, 49, 44, 0.06)",
        "soft-lg": "0 18px 42px rgba(58, 49, 44, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;