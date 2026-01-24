/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-yellow': '#E6FF2B',   // Primary Action
                'deep-petrol': '#000000',   // Black
                'petrol-light': '#121212',  // Very Dark Grey
                'cyber-black': '#000000',   // Black
                'surface-dark': '#000000',  // Black
                'tech-grey': '#8F9BA3',     // Text muted
                'border-grey': '#333333',   // Card borders
            },
            fontFamily: {
                'display': ['"Chakra Petch"', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'hex-pattern': "url('/hex-bg.svg')", // We will need to create this or use CSS rep
            }
        },
    },
    plugins: [],
}
