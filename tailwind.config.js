/** @type {import('tailwindcss').Config} */
// tailwind.config.js
// Configures Tailwind CSS for this project.
// Adds custom fonts, brand colors, and animation utilities.

module.exports = {
  // Tell Tailwind which files to scan for class names (for tree-shaking)
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Body text font — clean and modern
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        // Heading font — distinct display style
        display: ["'Outfit'", "sans-serif"],
        // Monospace — used for timestamps and data values
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Brand palette — mirrors the CSS variable values in globals.css
        brand: {
          teal: "#0D7377",    // Primary teal
          green: "#14A085",   // Secondary green
          orange: "#E07B39",  // Check-out / warning color
        },
      },
      animation: {
        // These class names can be used directly on elements
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "scan": "scan 2.5s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        // Fade from transparent to visible
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        // Slide up from 16px below while fading in
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        // Scanning line moves top to bottom (used on camera)
        scan: {
          "0%, 100%": { transform: "translateY(0%)", opacity: 0.6 },
          "50%": { transform: "translateY(100%)", opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
};
