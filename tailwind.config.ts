import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#cfe2f3",
        "nav-color": "#6d9eeb",
        blue0: "#9fc5e8",
        blue1: "#6fa8dc",
        blue2: "#3d85c6",
        blue3: "#0b5394",
        blue4: "#073763",
      },
    },
  },
  plugins: [],
};
export default config;
