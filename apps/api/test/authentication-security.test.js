const assert = require("node:assert/strict");
const { it } = require("node:test");
const bcrypt = require("bcryptjs");
const express = require("express");
const {
  HashPassword,
  PasswordNeedsRehash,
  VerifyHashPassword,
} = require("../src/services/authentication-tokens.service");
const { login } = require("../src/middlewares/authentication-rate-limit");
const { response } = require("../src/middlewares");

it("uses asynchronous bcrypt hashes and upgrades legacy password costs", async () => {
  const password = "security-regression-password";
  const currentHash = await HashPassword(password);
  const legacyHash = await bcrypt.hash(password, 8);

  assert.equal(bcrypt.getRounds(currentHash), 12);
  assert.equal(await VerifyHashPassword(password, currentHash), true);
  assert.equal(
    await VerifyHashPassword("incorrect-password", currentHash),
    false,
  );
  assert.equal(PasswordNeedsRehash(currentHash), false);
  assert.equal(PasswordNeedsRehash(legacyHash), true);
  assert.equal(await VerifyHashPassword(password, legacyHash), true);
});

it("loads the production SPA fallback with Express 5", () => {
  const originalNodeEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  try {
    const applicationPath = require.resolve("../src/app");
    delete require.cache[applicationPath];
    const { app } = require(applicationPath);

    assert.equal(typeof app.handle, "function");
    delete require.cache[applicationPath];
  } finally {
    if (originalNodeEnvironment === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnvironment;
    }
  }
});

it("limits repeated login requests and returns the API error envelope", async () => {
  const app = express();
  app.post("/login", login, (_request, response) => response.sendStatus(204));
  app.use(response.error);

  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/login`;

  try {
    const responses = [];
    for (let attempt = 0; attempt < 11; attempt += 1) {
      responses.push(await fetch(baseUrl, { method: "POST" }));
    }

    assert.equal(responses[9].status, 204);
    assert.equal(responses[10].status, 429);
    assert.equal((await responses[10].json()).error.code, "TOO_MANY_REQUESTS");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
