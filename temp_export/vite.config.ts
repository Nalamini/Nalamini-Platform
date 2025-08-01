import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

// ✅ Fix for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => {
  const isReplit = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;

  const plugins = [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ];

  if (isReplit) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});
