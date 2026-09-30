const logger = require("../utils/logger");
import type { ApiResponse } from "@bukit-delight/shared";

type HttpResponse = {
  status: (statusCode: number) => HttpResponse;
  json: (body: unknown) => unknown;
};

type HttpRequest = {
  method: string;
  path: string;
};

type ApiError = Error & {
  status?: number;
  code?: string | number;
};

type NextFunction = (error?: unknown) => void;

const createResponse = (
  name: string,
  message: string,
  code: string | number | undefined,
  status: number,
  data?: unknown,
): Omit<ApiResponse, "success" | "error"> => ({
  name,
  message,
  code,
  status,
  data,
});

const toSnakeCase = (field: string) =>
  field
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .toLowerCase();

const serializeResponseData = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(serializeResponseData);
  if (!value || typeof value !== "object" || value instanceof Date) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([field, fieldValue]) => [
      toSnakeCase(field),
      serializeResponseData(fieldValue),
    ]),
  );
};

exports.success = async (
  res: HttpResponse,
  message: string,
  code = 0,
  status = 200,
  data?: unknown,
): Promise<unknown> => {
  const serializedData = serializeResponseData(data);
  const json: ApiResponse = {
    success: true,
    ...createResponse(
      "Success",
      `${message} success`,
      code,
      status,
      serializedData,
    ),
  };
  return res.status(status).json(json);
};

exports.error = async (
  err: ApiError,
  req: HttpRequest,
  res: HttpResponse,
  next: NextFunction,
): Promise<unknown> => {
  const status = err.status || 500;
  const message = status >= 500 ? "Internal Server Error" : err.message;
  const statusCodes: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
  };
  const code = err.code || statusCodes[status] || "INTERNAL_SERVER_ERROR";

  if (status >= 500) {
    logger.error(
      { err, status, method: req.method, path: req.path },
      "API request failed",
    );
  }

  const json: ApiResponse = {
    success: false,
    error: { code: String(code), message },
    ...createResponse("Error", message, code, status),
  };
  return res.status(status).json(json);
};
