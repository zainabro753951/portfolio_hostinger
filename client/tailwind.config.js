/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "fira-code": ["Fira Code", "monospace"],
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        display: ["Oswald", "sans-serif"],
        heading: ["Inter", "sans-serif"],
      },
      colors: {
        // ── DESIGN SYSTEM TOKENS (source: src/design-tokens.css) ──
        brand: {
          cyan: "rgb(var(--brand-cyan) / <alpha-value>)",
          blue: "rgb(var(--brand-blue) / <alpha-value>)",
          purple: "rgb(var(--brand-purple) / <alpha-value>)",
        },
        surface: {
          void: "rgb(var(--surface-void) / <alpha-value>)",
          base: "rgb(var(--surface-base) / <alpha-value>)",
          secondary: "rgb(var(--surface-secondary) / <alpha-value>)",
          elevated: "rgb(var(--surface-elevated) / <alpha-value>)",
          card: "rgb(var(--surface-card) / <alpha-value>)",
          soft: "rgb(var(--surface-soft) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink-primary) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
        },
        line: {
          subtle: "var(--line-subtle)",
          strong: "var(--line-strong)",
        },
        // ── LEGACY (deprecated — keep until every page is migrated) ──
        "theme-purple": "#00d596",
        "theme-cyan": "#00d3ef",
        "light-blue": "#7a89ff",
        "theme-dark": "#0f0921",

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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom Neon Colors
        neon: {
          blue: "#4a90e2",
          purple: "#9b59b6",
          cyan: "#00d4ff",
        },
        dark: {
          void: "#050507",
          charcoal: "#1c1d20",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        "glow-cyan": "0 0 40px -8px var(--glow-cyan)",
        "glow-blue": "0 0 40px -8px var(--glow-blue)",
        "glow-purple": "0 0 40px -8px var(--glow-purple)",
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      screens: {
        xs: "300px",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};
