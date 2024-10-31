/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FBFBFB",
        "light-blue": "#CFDAEF",
        text: "#0E0E19",
        blue1: "#5E86CE",
        blue2: "#2F62BE",
        blue3: "#1B53B8",
        "darker-blue": "#24243F",
        purple: "#5E5EA5",
        secondary: "#22314C",
        gold: "#DDB75F",
      },
      fontFamily: {
        paralucent: ["Paralucent", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 10px #24243F, 0 0 20px #A9A9DF", //  Centered shadow
      },
    },
  },
  plugins: [require("daisyui")],
};
