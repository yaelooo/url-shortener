const plugin = require("tailwindcss/plugin")
/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      textColor: {
        "custom-primary": withOpacity("--color-primary"),
      },
      colors: {
        custom: {
          primary: withOpacity("--color-primary"),
          accent: withOpacity("--color-accent"),
          background: withOpacity("--color-background"),
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        h1: {
          "fontSize": theme("fontSize.4xl"),
          "lineHeight": theme("lineHeight.tight"),
          "fontWeight": "bold",
          "@screen lg": {
            fontSize: theme("fontSize.5xl"),
          },
          "@screen 2xl": {
            fontSize: theme("fontSize.6xl"),
          },
        },
        h2: {
          "fontSize": theme("fontSize.2xl"),
          "lineHeight": theme("lineHeight.tight"),
          "fontWeight": "bold",
          "@screen lg": {
            fontSize: theme("fontSize.3xl"),
          },
          "@screen 2xl": {
            fontSize: theme("fontSize.4xl"),
          },
        },
        h3: {
          "fontSize": theme("fontSize.lg"),
          "lineHeight": theme("lineHeight.tight"),
          "fontWeight": "bold",
          "@screen lg": {
            fontSize: theme("fontSize.xl"),
          },
          "@screen 2xl": {
            fontSize: theme("fontSize.2xl"),
          },
        },
      })
    }),
  ],
}
