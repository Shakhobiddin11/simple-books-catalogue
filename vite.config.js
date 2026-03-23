import { defineConfig } from "vite";

export default defineConfig({
  // Entry point is index.html at root
  root: ".",

  build: {
    // Output folder after npm run build
    outDir: "dist",
    rollupOptions: {
      input: "./index.html",
      output: {
        // JS output filename
        entryFileNames: "assets/[name].js",
        // CSS and other assets output
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});