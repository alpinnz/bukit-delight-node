import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerMenuPage from "./index";

vi.mock("@material-ui/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@material-ui/core")>();
  return {
    ...actual,
    Hidden: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

vi.mock("./mobile", () => ({
  default: () => <div>mobile menu</div>,
}));

vi.mock("../laptop.page", () => ({
  default: () => <div>desktop menu</div>,
}));

describe("CustomerMenuPage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders both responsive variants and sets the page title", () => {
    render(<CustomerMenuPage />);

    expect(screen.getAllByText("mobile menu")).toHaveLength(2);
    expect(screen.getByText("desktop menu")).toBeDefined();
    expect(document.title).toBe("Menu");
  });
});
