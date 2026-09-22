/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: "#16564F",
        mustard: "#E8B84B",
        cream: "#FFF8F3",
        label: "#16564F",
        line: "#E4DAD4"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,86,79,.08), 0 8px 24px rgba(22,86,79,.08)",
        card: "0 1px 2px rgba(22,86,79,.06), 0 4px 16px rgba(22,86,79,.07)"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Space Grotesk'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
