import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: {
          DEFAULT: "#24786d",
          soft: "#dff4ef",
          dark: "#8ce0d2"
        },
        focus: "#4967c9",
        amber: "#d18b18",
        coral: "#d95f46"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(20, 28, 42, 0.08)",
        darkSoft: "0 16px 48px rgba(0, 0, 0, 0.28)"
      },
      animation: {
        "fade-up": "fadeUp 420ms ease-out both",
        "soft-pulse": "softPulse 2.8s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        softPulse: {
          "0%, 100%": { opacity: "0.72" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
