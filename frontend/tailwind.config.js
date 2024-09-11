/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ], // non-abolute paths
    theme: {
        extend: {
            colors: {
                "default-blue": "#356FC5",
                "darker-blue": "#0056D2",
                "lighter-blue": "#2F80ED",
            },
            fontFamily: {
                interReg: ["Inter-Regular", "sans-Serif"],
                interBold: ["Inter-Bold", "sans-Serif"],
                interSemiBold: ["Inter-SemiBold", "sans-Serif"],
                interMedium: ["Inter-Medium", "sans-Serif"],
                interLight: ["Inter-Light", "sans-Serif"],
            },
        },
    },
    plugins: [],
};
