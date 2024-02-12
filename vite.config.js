import { defineConfig } from "vite";

import vitePluginString from "vite-plugin-string";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitePluginString()],
});
