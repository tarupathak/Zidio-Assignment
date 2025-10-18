import type { Config } from "tailwindcss";

const tailwindConfig: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          800: "#6b21a8", // replaces bg-purple-800
        },
        blue: {
          600: "#2563eb", // replaces text-blue-600
          500: "#3b82f6",
        },
        gray: {
          50: "#f9fafb",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          900: "#111827",
        },
        red: {
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
