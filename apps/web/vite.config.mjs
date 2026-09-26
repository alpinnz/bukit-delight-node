import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { loadEnv, transformWithEsbuild } from "vite";

const sourceDirectory = path.resolve("src").replace(/\\/g, "/");

const legacyJsx = {
  name: "legacy-jsx-in-js",
  enforce: "pre",
  transform(code, id) {
    const filename = id.split("?")[0].replace(/\\/g, "/");
    if (
      !filename.startsWith(`${sourceDirectory}/`) ||
      !filename.endsWith(".js")
    ) {
      return null;
    }

    return transformWithEsbuild(code, filename, {
      loader: "jsx",
      jsx: "automatic",
    });
  },
};

export default defineConfig(({ mode }) => {
  const apiEnvironment = loadEnv(mode, path.resolve(process.cwd(), "../.."), "");
  const apiPort = Number(apiEnvironment.API_PORT || apiEnvironment.PORT || 3000);
  if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535) {
    throw new Error("API_PORT or PORT must be a valid TCP port");
  }
  const apiProxyTarget = `http://localhost:${apiPort}`;

  return {
    plugins: [legacyJsx, react()],
    server: {
      port: 5173,
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
    },
  };
});
