import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
    alias: [{ find: "@io-boxies/js-lib", replacement: "/lib" }],
  },
  optimizeDeps: {
    exclude: [
      // 여기에 넣으면 모듈을 아예 불러오질 못함..
      // "danfojs",
      // "firebase",
      // "@io-boxies/js-lib",
      // "@io-boxies/vue-lib",
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
