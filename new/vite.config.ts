import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  publicDir: "public",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
