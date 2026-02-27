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
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-secondary-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-accent-foreground)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                card: {
                    DEFAULT: "var(--color-card)",
                    foreground: "var(--color-card-foreground)",
                },
                border: "var(--color-border)",
                input: "var(--color-input)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                serif: ["var(--font-serif)"],
                "open-sans": ["var(--font-open-sans)", "sans-serif"],
                mono: ["var(--font-open-sans)", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
        },
    },
    plugins: [],
};
export default config;
