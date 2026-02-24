import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages deployment base
  base: '/',
  
  server: {
    host: true,
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  
  plugins: [react()].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate sourcemaps for production debugging (disabled for speed)
    sourcemap: false,
    // Optimize for mobile - smaller chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-slot',
          ],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-maps': ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
  
  // Prefetch strategy for faster subsequent loads
  prefetchStrategy: 'viewport',
}));
