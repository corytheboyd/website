import tailwindcss from "@tailwindcss/vite";
import vueDevTools from "vite-plugin-vue-devtools";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    vueDevTools(),
    vue(),
    tailwindcss(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["localhost", "macbook.taild3766c.ts.net"],
  },
});
