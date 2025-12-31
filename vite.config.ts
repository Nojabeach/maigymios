import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    visualizer({
      filename: "dist/stats.html",
      open: false,
    }),
  ],
  build: {
    target: "ES2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-ui": ["@supabase/supabase-js"],
          "vendor-charts": ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Optimize image loading and lazy loading
    assetsInlineLimit: 4096,
  },
  server: {
    // Enable compression for dev server
    middlewareMode: true,
  },
});
