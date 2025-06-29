import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // This makes all paths relative
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    hmr: true,
  },
});
