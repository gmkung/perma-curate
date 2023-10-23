import type { Config } from "tailwindcss";
//import { chainColorMap, statusColorMap } from "@/utils/colorMappings";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  safelist: [
    "bg-yellow-600",
    "bg-teal-600",
    "bg-purple-700",
    "bg-yellow-600",
    "bg-orange-500",
    "bg-gray-400",
    "bg-green-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-blue-300",
    "bg-green-700",
    "bg-indigo-600",
    "bg-red-600",
    "bg-green-400",
    "bg-red-500",
    "bg-purple-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-green-600",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-gray-500",
  ],
  plugins: [],
};
export default config;
