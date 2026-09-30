import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MenuAction, { LOADING } from "./menus.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("MenuAction", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates a menu with its image, availability flags, and staff credentials", async () => {
    localStorage.setItem(
      "account",
      JSON.stringify({
        access_token: "staff-access",
        refresh_token: "staff-refresh",
      }),
    );
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();
    const image = new File(["image-bytes"], "coffee.png", {
      type: "image/png",
    });

    await MenuAction.onCreate({
      name: "Coffee",
      desc: "Hot drink",
      image,
      price: "12000",
      duration: "5",
      promo: "1000",
      category_id: "category-1",
      is_available: true,
      is_favorite: false,
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/menus",
        headers: expect.objectContaining({
          "x-access-token": "staff-access",
          "x-refresh-token": "staff-refresh",
        }),
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("name")).toBe("Coffee");
    expect(request.data.get("image")).toBe(image);
    expect(request.data.get("price")).toBe("12000");
    expect(request.data.get("promo")).toBe("1000");
    expect(request.data.get("category_id")).toBe("category-1");
    expect(request.data.get("is_available")).toBe("true");
    expect(request.data.get("is_favorite")).toBe("false");
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: LOADING, payload: false });
    });
  });

  it("updates menu fields without replacing an omitted image", async () => {
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();

    await MenuAction.onUpdate("menu-1", {
      name: "Coffee",
      desc: "Updated description",
      price: "13000",
      duration: "6",
      category_id: "category-1",
      is_available: true,
      is_favorite: true,
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        url: "api/v1/menus/menu-1",
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("name")).toBe("Coffee");
    expect(request.data.get("promo")).toBe("undefined");
    expect(request.data.get("image")).toBeNull();
  });
});
