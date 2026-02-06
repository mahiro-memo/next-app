import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: theme("colors.gray.300"),
            a: {
              color: theme("colors.blue.400"),
              "&:hover": {
                color: theme("colors.blue.300"),
              },
              textDecoration: "none",
            },
            h1: {
              color: theme("colors.white"),
              fontWeight: "800",
            },
            h2: {
              color: theme("colors.white"),
              fontWeight: "700",
            },
            h3: {
              color: theme("colors.white"),
              fontWeight: "600",
            },
            h4: {
              color: theme("colors.white"),
              fontWeight: "600",
            },
            strong: {
              color: theme("colors.white"),
              fontWeight: "600",
            },
            code: {
              color: theme("colors.amber.400"),
              backgroundColor: theme("colors.gray.900"),
              borderRadius: theme("borderRadius.DEFAULT"),
              paddingLeft: theme("spacing.1"),
              paddingRight: theme("spacing.1"),
              paddingTop: theme("spacing.0.5"),
              paddingBottom: theme("spacing.0.5"),
              fontWeight: "500",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: theme("colors.gray.900"),
              color: theme("colors.gray.300"),
              borderWidth: "1px",
              borderColor: theme("colors.gray.700"),
              borderRadius: theme("borderRadius.lg"),
            },
            "pre code": {
              backgroundColor: "transparent",
              color: "inherit",
              padding: "0",
            },
            blockquote: {
              color: theme("colors.gray.400"),
              borderLeftColor: theme("colors.gray.600"),
              fontStyle: "italic",
            },
            hr: {
              borderColor: theme("colors.gray.700"),
            },
            "ul > li::marker": {
              color: theme("colors.gray.500"),
            },
            "ol > li::marker": {
              color: theme("colors.gray.500"),
            },
            thead: {
              borderBottomColor: theme("colors.gray.600"),
            },
            "thead th": {
              color: theme("colors.white"),
            },
            "tbody tr": {
              borderBottomColor: theme("colors.gray.700"),
            },
            "tbody td": {
              color: theme("colors.gray.300"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
