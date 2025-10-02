// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
        colors: {
            cream: '#FFF8DC',
            brown: '#660000',
            cyan: '#ccffff',
        },
        fontFamily: {
            mplus: ['M PLUS Rounded 1c', 'sans-serif'],
        },
        },
    },
    plugins: [],
};

export default config;