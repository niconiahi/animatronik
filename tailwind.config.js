/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        max: "max(16px, 2.9166666667vw)",
      },
      borderRadius: {
        max: "max(3px,0.4166666667vw)",
      },
    },
  },
  plugins: [],
};
