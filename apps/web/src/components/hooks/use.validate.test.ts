import { describe, expect, it, vi } from "vitest";
import useValidate from "./use.validate";

describe("useValidate", () => {
  it("collects required, number, email, and password mismatch errors", async () => {
    const state = {
      fields: {
        username: "",
        price: "12.5",
        password: "secret",
        repeat_password: "different",
      },
      errors: {},
    };
    const setState = vi.fn();

    const isValid = await useValidate(state, setState, [
      { key: "username", validate: ["required"] },
      { key: "price", validate: ["number"] },
      { key: "password", validate: ["match-passowrd"] },
    ]);

    expect(isValid).toBe(false);
    expect(setState).toHaveBeenCalledWith({
      ...state,
      errors: {
        username: "Cannot be empty",
        price: "Only numbers",
        password: "Password not match",
        repeat_password: "Password not match",
      },
    });
  });

  it("accepts valid fields and replaces stale errors", async () => {
    const state = {
      fields: {
        username: "customer",
        price: "1200",
        email: "customer@example.com",
        password: "secret",
        repeat_password: "secret",
      },
      errors: { username: "old error" },
    };
    const setState = vi.fn();

    await expect(
      useValidate(state, setState, [
        { key: "username", validate: ["required"] },
        { key: "price", validate: ["number"] },
        { key: "email", validate: ["email"] },
        { key: "repeat_password", validate: ["match-passowrd"] },
      ]),
    ).resolves.toBe(true);
    expect(setState).toHaveBeenCalledWith({ ...state, errors: {} });
  });
});
