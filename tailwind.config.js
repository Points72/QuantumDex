/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App Router files
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // UI components
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // Libraries
    "./node_modules/@uploadthing/react/dist/**/*.{js,ts,jsx,tsx}", // External library
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4A90E2", // Quantum blue
          foreground: "#FFFFFF", // White for contrast
        },
        secondary: {
          DEFAULT: "#7A88FF", // Quantum purple
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF4D4F", // Red for destructive actions
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#4A5568", // Gray for muted elements
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#E53E3E", // Red accent
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#1A1B3E", // Dark card background from your theme
          foreground: "#FFFFFF",
        },
        // Add your quantum-themed colors
        quantumDark: "#0A0B1E", // Background color from globals.css
        quantumBlue: "#4A90E2", // Primary color
        quantumPurple: "#7A88FF", // Secondary color
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)", // Default radius of 0.5rem if --radius not set
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
      animation: {
        "spin-slow": "spin-slow 20s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "quantum-shift": "quantum-shift 1s ease-in-out",
        "quantum-pulse": "quantum-pulse 2s infinite",
        "quantum-flicker": "quantum-flicker 2s infinite",
        "pulse-slow": "pulse-glow 10s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};