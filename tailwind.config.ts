import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1a3e",
          50: "#eef1f8",
          100: "#d5dae8",
          200: "#aab4d1",
          300: "#7f8fba",
          400: "#546aa3",
          500: "#3a4f86",
          600: "#2a3a66",
          700: "#1a2a5e",
          800: "#0f1f4a",
          900: "#0a1a3e",
          950: "#050f24",
        },
        gold: {
          DEFAULT: "#c9a96e",
          50: "#fbf6ec",
          100: "#f5ead0",
          200: "#ecd29c",
          300: "#e0bb6b",
          400: "#d4ab53",
          500: "#c9a96e",
          600: "#b8924a",
          700: "#9a753c",
          800: "#7e5f34",
          900: "#694e2e",
          champagne: "#e8d4a8",
        },
        cream: "#faf8f4",
        charcoal: "#1a1a1a",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.2" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gold": "linear-gradient(135deg, #e0bb6b 0%, #c9a96e 50%, #b8924a 100%)",
        "gradient-navy": "linear-gradient(135deg, #0f1f4a 0%, #0a1a3e 50%, #050f24 100%)",
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(201, 169, 110, 0.5)",
        "gold-lg": "0 20px 60px -15px rgba(201, 169, 110, 0.6)",
        navy: "0 20px 60px -15px rgba(10, 26, 62, 0.4)",
        card: "0 10px 40px -10px rgba(10, 26, 62, 0.15)",
        "card-hover": "0 30px 70px -20px rgba(10, 26, 62, 0.35)",
        glass: "0 8px 32px rgba(10, 26, 62, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-down": "fadeDown 0.8s ease-out forwards",
        "slide-right": "slideRight 0.8s ease-out forwards",
        "slide-left": "slideLeft 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 169, 110, 0.4)" },
          "50%": { boxShadow: "0 0 0 20px rgba(201, 169, 110, 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
