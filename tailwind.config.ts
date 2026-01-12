import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#f5f5f5",
          alt: "#f7f7f7",
          hover: "#fafafa",
        },
        foreground: "#343434",
        accent: "#ff6a3d",
        subtitle: "#4a4a4a",
        muted: "#f5f5f5",
        surface: {
          dark: "#1f1f1f",
        },
        highlight: {
          DEFAULT: "#facc15",
          faded: "#b8a033",
        },
        bar: {
          DEFAULT: "#f5f5f5",
          faded: "#a3a3a3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        alt: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-bowlby-one)", "sans-serif"],
        garamond: ["var(--font-eb-garamond)", "serif"],
      },
      fontSize: {
        "title-strong": [
          "3.75rem",
          { lineHeight: "1.05", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        eyebrow: [
          "0.75rem",
          { letterSpacing: "0.14em", fontWeight: "300" },
        ],
        subtitle: [
          "0.9375rem",
          { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        "audio-title": [
          "1.25rem",
          { lineHeight: "1.2", fontWeight: "700" },
        ],
      },
      letterSpacing: {
        eyebrow: "0.14em",
        display: "0.01em",
        subtitle: "0.02em",
        highlight: "0.3em",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#343434",
            a: {
              color: "#ff6a3d",
            },
            strong: {
              color: "#343434",
            },
            blockquote: {
              borderLeftColor: "#ff6a3d",
              fontStyle: "italic",
              paddingLeft: "5px",
              borderLeftWidth: "3.5px",
            },
            h1: {
              fontFamily: "var(--font-bowlby-one)",
              letterSpacing: "0.01em",
            },
            h2: {
              fontFamily: "var(--font-bowlby-one)",
              color: "#ff6a3d",
              letterSpacing: "0.01em",
            },
            h3: {
              fontFamily: "var(--font-bowlby-one)",
              letterSpacing: "0.01em",
            },
            h4: {
              fontFamily: "var(--font-bowlby-one)",
              letterSpacing: "0.01em",
            },
            p: {
              color: "#4a4a4a",
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config;
