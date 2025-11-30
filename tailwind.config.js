// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: Ensure these paths match your project structure (src/app and src/components)
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // <-- This is the crucial line for fixing spacing
  ],
};
