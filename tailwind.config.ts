import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0A0A0B",
          50: "#1A1A1C",
          100: "#141416",
          200: "#0F0F11",
        },
        graphite: {
          DEFAULT: "#1C1C1E",
          light: "#2A2A2E",
          muted: "#3A3A40",
        },
        gold: {
          DEFAULT: "#C9A962",
          light: "#E8D5A3",
          dark: "#9A7B3C",
          muted: "#8B7344",
        },
        ivory: "#F5F5F0",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "carbon-texture":
          "radial-gradient(circle at 25% 25%, rgba(201, 169, 98, 0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%), linear-gradient(180deg, #0A0A0B 0%, #141416 50%, #0A0A0B 100%)",
        "gold-shimmer":
          "linear-gradient(135deg, #C9A962 0%, #E8D5A3 50%, #9A7B3C 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
