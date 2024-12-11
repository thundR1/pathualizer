/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        wall: "rgb(12, 53, 71)",
        disabled: "#94a3b8",
      },
    },
  },
  plugins: [],
};
