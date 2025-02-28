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
        'primary': '#343434',
        'accent': {
          DEFAULT: '#FF4500', // orangered
          light: 'hsl(16, 92%, 90%)'
        },
        'sage': {
          DEFAULT: '#95B365',
          light: '#DDE9CC',
          dark: '#718B4C'
        },
        'background': {
          DEFAULT: '#FFFFFF',
          alt: '#f2f2f2',
          hover: '#f5f5f5'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        title: ['var(--font-bluu-next)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            'blockquote': {
              borderLeftColor: '#FF4500',
              fontStyle: 'italic',
              paddingLeft: '5px',
              borderLeftWidth: '3.5px',
            },
            h1: {
              fontFamily: 'var(--font-bluu-next)',
            },
            h2: {
              fontFamily: 'var(--font-bluu-next)',
              color: '#FF4500',
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config;
