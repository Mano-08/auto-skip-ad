import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // Output directory
    assetsDir: "assets", // Directory for static assets
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
      },
      input: {
        main: "./src/contentScript.ts",
      },
    },
  },
});
