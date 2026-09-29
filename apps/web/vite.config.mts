import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import process from "node:process";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const apiEnvironment = loadEnv(
    mode,
    path.resolve(process.cwd(), "../.."),
    "",
  );
  const apiPort = Number(
    process.env.API_PORT ||
      apiEnvironment.API_PORT ||
      apiEnvironment.PORT ||
      3000,
  );
  if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535) {
    throw new Error("API_PORT or PORT must be a valid TCP port");
  }
  const apiHost =
    process.env.API_HOST || apiEnvironment.API_HOST || "localhost";
  const apiProxyTarget = `http://${apiHost}:${apiPort}`;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      watch: {
        usePolling: process.env.VITE_USE_POLLING === "true",
        interval: 300,
      },
      hmr: process.env.VITE_HMR_CLIENT_PORT
        ? { clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) }
        : undefined,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("proxyReq", (proxyRequest) => {
              proxyRequest.removeHeader("origin");
            });
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      restoreMocks: true,
      setupFiles: "./src/test.setup.ts",
    },
  };
});
