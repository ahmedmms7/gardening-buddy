import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";
import honoDevPlugin from "./vite/__plugins/hono-dev-plugin";
import assetOptimizerPlugin from "./vite/__plugins/asset-optimizer-plugin";
import { gardenPwaPlugin } from "./pwa-plugin";

const root = path.resolve(__dirname, "../..");
const websitePort = 4200;

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, root, "");
  Object.assign(process.env, env);
  // The template root env defaults to development. A production build must
  // still use production React and enable the production-only offline shell.
  process.env.NODE_ENV = command === "build" ? "production" : "development";
  process.env.VITE_USER_NODE_ENV = process.env.NODE_ENV;

  return {
    // All env files live at the repo root — keep Vite's own env loading there too,
    // so packages/web/.env* files can never shadow the root .env.
    envDir: root,
    plugins: [
      honoDevPlugin(),
      react(),
      tailwind(),
      assetOptimizerPlugin(),
      gardenPwaPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/web"),
      },
    },
    server: {
      port: websitePort,
      strictPort: true,
      allowedHosts: true,
      hmr: { overlay: false },
      cors: false,
    },
  };
});
