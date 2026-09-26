import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerCartPage from "./index";

vi.mock("@material-ui/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@material-ui/core")>();
  return {
    ...actual,
    Hidden: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

vi.mock("./mobile", () => ({ default: () => <div>mobile cart</div> }));

vi.mock("../laptop.page", () => ({
  default: () => <div>desktop cart</div>,
}));

describe("CustomerCartPage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders responsive variants and sets the page title", () => {
    render(<CustomerCartPage />);

    expect(screen.getAllByText("mobile cart")).toHaveLength(2);
    expect(screen.getByText("desktop cart")).toBeDefined();
    expect(document.title).toBe("Cart");
  });
});
