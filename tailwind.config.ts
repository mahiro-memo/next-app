import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#e5e5e5",
            a: {
              color: "#60a5fa",
              "&:hover": {
                color: "#93c5fd",
              },
            },
            h1: {
              color: "#ffffff",
            },
            h2: {
              color: "#ffffff",
            },
            h3: {
              color: "#ffffff",
            },
            h4: {
              color: "#ffffff",
            },
            strong: {
              color: "#ffffff",
            },
            code: {
              color: "#fbbf24",
              backgroundColor: "#1a1a1a",
              borderRadius: "0.25rem",
              paddingLeft: "0.375rem",
              paddingRight: "0.375rem",
              paddingTop: "0.125rem",
              paddingBottom: "0.125rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: "#1a1a1a",
              color: "#e5e5e5",
              borderWidth: "1px",
              borderColor: "#374151",
            },
            blockquote: {
              color: "#9ca3af",
              borderLeftColor: "#4b5563",
            },
            hr: {
              borderColor: "#374151",
            },
            "ul > li::marker": {
              color: "#9ca3af",
            },
            "ol > li::marker": {
              color: "#9ca3af",
            },
            thead: {
              borderBottomColor: "#4b5563",
            },
            "tbody tr": {
              borderBottomColor: "#374151",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
