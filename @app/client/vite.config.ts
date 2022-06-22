import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
    },
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});
