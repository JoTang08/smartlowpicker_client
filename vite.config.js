import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 原有：@ => src
      "@url": path.resolve(__dirname, "./src/api/url.js"),
      "@request": path.resolve(__dirname, "./src/api/request.js"), // 新增别名：@axios => request.js
    },
  },
});
