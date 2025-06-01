/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    // Enhanced responsive breakpoints
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Custom breakpoints for specific use cases
      mobile: { max: "767px" },
      tablet: { min: "768px", max: "1023px" },
      desktop: { min: "1024px" },
      wide: { min: "1536px" },
      // Orientation-based breakpoints
      portrait: { raw: "(orientation: portrait)" },
      landscape: { raw: "(orientation: landscape)" },
      // Touch device detection
      touch: { raw: "(hover: none) and (pointer: coarse)" },
      "no-touch": { raw: "(hover: hover) and (pointer: fine)" },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      // Enhanced spacing scale for responsive design
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      // Responsive font sizes
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        // Responsive text sizes
        "responsive-xs": [
          "clamp(0.75rem, 2vw, 0.875rem)",
          { lineHeight: "1.2" },
        ],
        "responsive-sm": [
          "clamp(0.875rem, 2.5vw, 1rem)",
          { lineHeight: "1.3" },
        ],
        "responsive-base": [
          "clamp(1rem, 3vw, 1.125rem)",
          { lineHeight: "1.4" },
        ],
        "responsive-lg": [
          "clamp(1.125rem, 3.5vw, 1.25rem)",
          { lineHeight: "1.4" },
        ],
        "responsive-xl": ["clamp(1.25rem, 4vw, 1.5rem)", { lineHeight: "1.3" }],
        "responsive-2xl": ["clamp(1.5rem, 5vw, 2rem)", { lineHeight: "1.2" }],
        "responsive-3xl": [
          "clamp(1.875rem, 6vw, 2.5rem)",
          { lineHeight: "1.1" },
        ],
      },
      // Enhanced grid system
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
        // Responsive grid templates
        "auto-fit-xs": "repeat(auto-fit, minmax(200px, 1fr))",
        "auto-fit-sm": "repeat(auto-fit, minmax(250px, 1fr))",
        "auto-fit-md": "repeat(auto-fit, minmax(300px, 1fr))",
        "auto-fit-lg": "repeat(auto-fit, minmax(350px, 1fr))",
      },
      // Animation and transitions
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
        "slide-in-down": "slideInDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -8px, 0)" },
          "70%": { transform: "translate3d(0, -4px, 0)" },
          "90%": { transform: "translate3d(0, -2px, 0)" },
        },
      },
      // Enhanced color system
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", "monospace"],
      },
      // Enhanced shadows for depth
      boxShadow: {
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
        medium: "0 4px 16px 0 rgba(0, 0, 0, 0.1)",
        strong: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
      },
      // Responsive utilities
      minHeight: {
        "screen-mobile": "100vh",
        "screen-safe":
          "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
      },
      maxWidth: {
        "screen-mobile": "100vw",
        "container-xs": "475px",
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
        "container-2xl": "1536px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
