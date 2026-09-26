import pino from "pino";

const logger = pino({
  name: "bukit-delight-api",
  level: process.env.LOG_LEVEL || "info",
});

export = logger;
