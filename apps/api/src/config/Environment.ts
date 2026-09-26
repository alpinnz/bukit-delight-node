import { z } from "zod";

const environmentSchema = z.object({
  API_KEY: z.string().min(1),
  APP_KEY: z.string().min(1),
  ACCESS_TOKEN_KEY: z.string().min(1),
  ACCESS_TOKEN_TIMEOUT: z.coerce.number().int().positive(),
  REFRESH_TOKEN_KEY: z.string().min(1),
  REFRESH_TOKEN_TIMEOUT: z.coerce.number().int().positive(),
  ORDERS_TIMEOUT: z.coerce.number().int().positive(),
  CLIENT_URL: z.string().min(1),
  PATH_UPLOADS: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().optional(),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
});

exports.validate = () => {
  const parsed = environmentSchema.safeParse(process.env);
  if (!parsed.success) {
    const invalidVariables = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    throw new Error(
      `Missing or invalid environment variables: ${invalidVariables}`,
    );
  }

  return parsed.data;
};
