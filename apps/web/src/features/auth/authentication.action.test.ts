import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthenticationAction, { MOUNT } from "./authentication.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("AuthenticationAction.onMount", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("skips refresh when there is no saved account", async () => {
    const dispatch = vi.fn();

    await AuthenticationAction.onMount()(
      dispatch as never,
      (() => ({})) as never,
      undefined,
    );

    expect(axios).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: MOUNT });
  });
});
