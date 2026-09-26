import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CategoriesAction, { LOADING } from "./categories.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("CategoriesAction", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates a category with its image and saved admin credentials", async () => {
    localStorage.setItem(
      "account",
      JSON.stringify({
        accessToken: "admin-access",
        refreshToken: "admin-refresh",
      }),
    );
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();
    const image = new File(["image-bytes"], "coffee.png", {
      type: "image/png",
    });

    await CategoriesAction.onCreate({
      name: "Coffee",
      desc: "Hot drinks",
      image,
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/categories/",
        headers: expect.objectContaining({
          "x-access-token": "admin-access",
          "x-refresh-token": "admin-refresh",
        }),
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("name")).toBe("Coffee");
    expect(request.data.get("desc")).toBe("Hot drinks");
    expect(request.data.get("image")).toBe(image);
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: LOADING, payload: false });
    });
  });

  it("updates category details without replacing an omitted image", async () => {
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();

    await CategoriesAction.onUpdate("category-1", {
      name: "Coffee",
      desc: "Updated description",
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        url: "api/v1/categories/category-1",
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("name")).toBe("Coffee");
    expect(request.data.get("image")).toBeNull();
  });
});
