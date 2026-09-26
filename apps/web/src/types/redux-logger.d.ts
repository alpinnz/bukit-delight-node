declare module "redux-logger" {
  import type { Middleware } from "redux";

  export function createLogger(): Middleware;
}
