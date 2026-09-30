import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FavoritesAction, { LOADING, SET_FAVORITES } from "./favorites.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("FavoritesAction.onLoad", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads favorite analysis using staff credentials", async () => {
    const account = {
      access_token: "staff-access",
      refresh_token: "staff-refresh",
    };
    const favorites = { favorite_menus: [{ id: "menu-1" }] };
    localStorage.setItem("account", JSON.stringify(account));
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: favorites },
    } as never);
    const dispatch = vi.fn();

    await FavoritesAction.onLoad()(
      dispatch as never,
      (() => ({})) as never,
      undefined,
    );

    expect(dispatch).toHaveBeenCalledWith({ type: LOADING, payload: true });
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "api/v1/recommendations/favorites",
        headers: expect.objectContaining({
          "x-access-token": account.access_token,
          "x-refresh-token": account.refresh_token,
        }),
      }),
    );
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_FAVORITES,
        payload: favorites,
      });
    });
  });
});
