import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  mode: "development",
  build: {
    outDir: "./serve/dist",
  },
  server: {
    proxy: {
      "/graphql": {
        target: "http://server-service",
        changeOrigin: true,
      },
      // "/auth": {
      //   target: "http://hanko-service",
      //   changeOrigin: true,
      // },
    },
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});
