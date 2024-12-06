import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import ViteYaml from '@modyfi/vite-plugin-yaml';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteYaml()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
});
