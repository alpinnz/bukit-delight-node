import type { NextFunction, Request, Response } from "express";

const path = require("path");
const compiledDirectory = path.basename(path.dirname(__dirname)) === "dist";
const workspaceDirectory = path.resolve(
  __dirname,
  compiledDirectory ? "../../../../" : "../../../",
);
require("dotenv").config({ path: path.join(workspaceDirectory, ".env") });
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { Environment } = require("./config");
const { prisma } = require("./config/Prisma");
const index = require("./routes");
const { Response } = require("./middlewares");
const logger = require("./utils/logger");

const port = process.env.API_PORT || process.env.PORT || 3000;
const app = express();
const trustedProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (trustedProxyHops > 0) app.set("trust proxy", trustedProxyHops);
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed"));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const apiDirectory =
  path.basename(path.dirname(__dirname)) === "dist"
    ? path.resolve(__dirname, "../../")
    : path.resolve(__dirname, "../");
app.use("/public", express.static(path.join(apiDirectory, "public")));

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok" });
});

app.get("/healthz", (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok" });
});

app.get("/readyz", async (_request: Request, response: Response) => {
  let ready = Boolean(prisma);
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      ready = false;
    }
  }
  return response.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not-ready",
  });
});

app.use(index);

if (process.env.NODE_ENV === "production") {
  const frontendBuild = path.resolve(apiDirectory, "../web/dist");
  app.use(express.static(frontendBuild));
  app.get(
    "/{*splat}",
    (request: Request, response: Response, next: NextFunction) => {
      if (
        request.path.startsWith("/api/") ||
        request.path.startsWith("/public/")
      ) {
        return next();
      }
      return response.sendFile(path.join(frontendBuild, "index.html"));
    },
  );
}

app.use((_request: Request, _response: Response, next: NextFunction) => {
  const error = Object.assign(new Error("Route not found"), { status: 404 });
  next(error);
});

app.use(Response.Error);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});
app.io = io;

const start = async () => {
  Environment.validate();
  if (!prisma) throw new Error("DATABASE_URL is required");
  await prisma.$connect();
  return new Promise((resolve) => {
    server.listen(port, () => {
      logger.info({ port }, "API server started");
      resolve(server);
    });
  });
};

const shutdown = async (signal: string) => {
  logger.info({ signal }, "API server shutting down");
  io.close();
  await new Promise((resolve) => server.close(resolve));
  await prisma?.$disconnect();
};

if (require.main === module) {
  start().catch((error: unknown) => {
    logger.fatal({ err: error }, "API startup failed");
    process.exitCode = 1;
  });
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

export = { app, server, start, shutdown };
