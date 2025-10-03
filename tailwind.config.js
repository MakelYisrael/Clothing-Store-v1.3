/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                border: "#e5e7eb",
            },
        },
    },
    plugins: [],
}
