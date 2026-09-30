const application: {
  start: () => Promise<unknown>;
  shutdown: (signal: string) => Promise<void>;
} = require("./app");

application.start().catch((error: unknown) => {
  console.error("API startup failed", error);
  process.exitCode = 1;
});

process.on("SIGTERM", () => application.shutdown("SIGTERM"));
process.on("SIGINT", () => application.shutdown("SIGINT"));
