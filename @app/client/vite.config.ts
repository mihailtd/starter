import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "./serve/dist",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    cors: {
      origin: "http://server.local.starter.com",
    },
  },
});
