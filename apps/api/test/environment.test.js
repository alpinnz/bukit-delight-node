const assert = require("node:assert/strict");
const { test } = require("node:test");
const { validate } = require("../src/config/Environment");

test("requires a positive order timeout", () => {
  const previousValues = new Map(
    [
      "API_KEY",
      "APP_KEY",
      "ACCESS_TOKEN_KEY",
      "ACCESS_TOKEN_TIMEOUT",
      "REFRESH_TOKEN_KEY",
      "REFRESH_TOKEN_TIMEOUT",
      "API_PORT",
      "CLIENT_URL",
      "PATH_UPLOADS",
      "DATABASE_URL",
      "ORDERS_TIMEOUT",
      "UNRELATED_ENV_VALUE",
    ].map((key) => [key, process.env[key]]),
  );

  try {
    Object.assign(process.env, {
      API_KEY: "test-api-key",
      APP_KEY: "test-app-key",
      ACCESS_TOKEN_KEY: "test-access-key",
      ACCESS_TOKEN_TIMEOUT: "60000",
      REFRESH_TOKEN_KEY: "test-refresh-key",
      REFRESH_TOKEN_TIMEOUT: "60000",
      CLIENT_URL: "http://localhost:5173",
      PATH_UPLOADS: "public/uploads",
      DATABASE_URL:
        "postgresql://postgres:postgres@localhost:5433/bukit_delight",
    });
    delete process.env.ORDERS_TIMEOUT;

    assert.throws(validate, /ORDERS_TIMEOUT/);

    process.env.ORDERS_TIMEOUT = "60000";
    assert.equal(validate().ORDERS_TIMEOUT, 60000);

    process.env.API_PORT = "3000";
    process.env.UNRELATED_ENV_VALUE = "ignored";
    const validatedEnvironment = validate();
    assert.equal(validatedEnvironment.API_PORT, 3000);
    assert.equal("UNRELATED_ENV_VALUE" in validatedEnvironment, false);

    delete process.env.API_PORT;
    process.env.DATABASE_URL = "not-a-url";
    assert.throws(validate, /DATABASE_URL/);
  } finally {
    for (const [key, value] of previousValues) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
