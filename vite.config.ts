import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  // REMOVE the css.transformer: 'lightningcss' line
  build: {
    // You can keep this; it tells Vite to use Lightning for the final minification pass
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react")) {
            return "react-vendor";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    process.env.ANALYZE === "true" &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
});
