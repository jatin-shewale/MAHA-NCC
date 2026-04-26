/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        ink: "#07101e",
        canvas: "#f2f6fb",
        brand: {
          50: "#eef8ff",
          100: "#d8eeff",
          200: "#b9e0ff",
          300: "#84c7ff",
          400: "#4aa7ff",
          500: "#1a87ff",
          600: "#0b68db",
          700: "#0f53ad",
          800: "#124689",
          900: "#14386d"
        },
        command: "#b88a2f",
        military: "#334d39"
      },
      boxShadow: {
        glow: "0 10px 40px rgba(21, 102, 255, 0.18)",
        soft: "0 16px 50px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 20% 20%, rgba(26, 135, 255, 0.18), transparent 34%), radial-gradient(circle at 80% 0%, rgba(184, 138, 47, 0.18), transparent 30%), radial-gradient(circle at 50% 100%, rgba(51, 77, 57, 0.16), transparent 34%)"
      }
    }
  },
  plugins: []
};
