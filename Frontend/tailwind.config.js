/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Hanken: ["Hanken Grotesk" , "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiory: "var(--color-tertiory)",
        neutral: "var(--color-neutral)",
      },
      spacing: {
        custom: "var(--custom-spacing)",
      },
    },
  },
  plugins: [],
};