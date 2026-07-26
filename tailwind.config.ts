import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: "#6B1E3C",
          dark: "#3F1024",
          light: "#8C3357",
        },
        rosegold: "#D9A6A0",
        vanilla: "#FFF3E4",
        blush: "#F7D9E3",
        neon: "#FF5C8A",
        ink: "#2B1620",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
        scriptnew: ['"Great Vibes"', "cursive"],
        bodynew: ["Inter", "sans-serif"],
        elegant: ['"Alex Brush"', "cursive"],
      },

      backgroundImage: {
        "wine-glow":
          "radial-gradient(circle at 30% 20%, rgba(255,92,138,0.25), transparent 55%), radial-gradient(circle at 80% 80%, rgba(217,166,160,0.2), transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,92,138,0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        heartbeat: "heartbeat 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
