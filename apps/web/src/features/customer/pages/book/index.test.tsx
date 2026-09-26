import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerBookPage from "./index";

vi.mock("@material-ui/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@material-ui/core")>();
  return {
    ...actual,
    Hidden: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});
vi.mock("./mobile", () => ({ default: () => <div>mobile book</div> }));
vi.mock("../laptop.page", () => ({
  default: () => <div>laptop customer</div>,
}));

describe("CustomerBookPage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders responsive mobile and laptop variants and sets the page title", () => {
    render(<CustomerBookPage />);

    expect(screen.getAllByText("mobile book")).toHaveLength(2);
    expect(screen.getByText("laptop customer")).toBeDefined();
    expect(document.title).toBe("Book");
  });
});
