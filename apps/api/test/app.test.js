const { after, before, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { server } = require("../src/app");
const AuthenticationService = require("../src/services/authentication-tokens.service");

describe("HTTP health and error contracts", () => {
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => server.listen(0, resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  it("issues access tokens for Prisma string IDs", async () => {
    const previousSecret = process.env.ACCESS_TOKEN_KEY;
    const previousTimeout = process.env.ACCESS_TOKEN_TIMEOUT;
    process.env.ACCESS_TOKEN_KEY = "test-access-token-secret";
    process.env.ACCESS_TOKEN_TIMEOUT = "60000";

    try {
      const token = await AuthenticationService.JwtAccessToken({
        id: "prisma-account-id",
      });
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

      assert.equal(decoded.id, "prisma-account-id");
      assert.equal(decoded.type, undefined);
    } finally {
      if (previousSecret === undefined) delete process.env.ACCESS_TOKEN_KEY;
      else process.env.ACCESS_TOKEN_KEY = previousSecret;
      if (previousTimeout === undefined)
        delete process.env.ACCESS_TOKEN_TIMEOUT;
      else process.env.ACCESS_TOKEN_TIMEOUT = previousTimeout;
    }
  });

  it("returns the documented health response", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  });

  it("returns a safe structured 404", async () => {
    const response = await fetch(`${baseUrl}/missing-route`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.deepEqual(body.error, {
      code: "NOT_FOUND",
      message: "Route not found",
    });
    assert.equal(body.status, 404);
    assert.equal(body.message, body.error.message);
  });

  it("rejects malformed identifiers before database access", async () => {
    const response = await fetch(`${baseUrl}/api/v1/menus/not-an-id`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, "BAD_REQUEST");
  });

  it("validates registration payloads before database access", async () => {
    const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "BAD_REQUEST");
  });

  it("requires a password policy for customer registration", async () => {
    const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: "customer@example.test",
        email: "customer@example.test",
        password: "Password123",
        repeat_password: "Password123",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, "BAD_REQUEST");
  });

  it("does not allow unauthenticated guest customer creation", async () => {
    const response = await fetch(`${baseUrl}/api/v1/customers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "guest" }),
    });

    assert.equal(response.status, 401);
  });
});
