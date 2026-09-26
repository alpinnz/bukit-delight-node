import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerHomePage from "./home";

vi.mock("@material-ui/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@material-ui/core")>();
  return {
    ...actual,
    Hidden: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

vi.mock("./home/mobile", () => ({
  default: () => <div>mobile home</div>,
}));

vi.mock("./laptop.page", () => ({
  default: () => <div>desktop home</div>,
}));

describe("CustomerHomePage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders the responsive home layouts and sets the page title", () => {
    render(<CustomerHomePage />);

    expect(screen.getAllByText("mobile home")).toHaveLength(2);
    expect(screen.getByText("desktop home")).toBeDefined();
    expect(document.title).toBe("Home");
  });
});
