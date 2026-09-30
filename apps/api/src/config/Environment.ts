const Joi = require("joi");

const environmentSchema = Joi.object({
  API_KEY: Joi.string().min(1).required(),
  APP_KEY: Joi.string().min(1).required(),
  ACCESS_TOKEN_KEY: Joi.string().min(1).required(),
  ACCESS_TOKEN_TIMEOUT: Joi.number().integer().positive().required(),
  REFRESH_TOKEN_KEY: Joi.string().min(1).required(),
  REFRESH_TOKEN_TIMEOUT: Joi.number().integer().positive().required(),
  ORDERS_TIMEOUT: Joi.number().integer().positive().required(),
  CLIENT_URL: Joi.string().min(1).required(),
  PATH_UPLOADS: Joi.string().min(1).required(),
  API_PORT: Joi.number().integer().positive().optional(),
  TRUST_PROXY_HOPS: Joi.number().integer().min(0).optional(),
  DATABASE_URL: Joi.string().uri().required(),
});

exports.validate = () => {
  const { error, value } = environmentSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: { objects: true },
  });

  if (error) {
    const invalidVariables = error.details
      .map((issue: { path: Array<string | number> }) => issue.path.join("."))
      .join(", ");
    throw new Error(
      `Missing or invalid environment variables: ${invalidVariables}`,
    );
  }

  return value;
};
