import type {Config} from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'Rix':['Rix', 'sans-serif'],
                'Gangwon':['Gangwon', 'sans-serif'],
                'Batang':['Batang', 'sans-serif'],
                'ONE':['ONE', 'sans-serif'],
                'Paperlogy':['"Paperlogy"', 'sans-serif'],
                'jalnan':['"jalnan"', 'sans-serif'],
            },
            animation: {
                fadeIn: 'fadeIn 1s ease-in-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': {opacity: '0'},
                    '100%': {opacity: '1'},
                },
                scaleIn:{
                    '0%': {transform: 'scale(0)'},
                    '100%': {transform: 'scale(1)'},
                }
            },
        },
    },
    plugins: [],
}

export default config