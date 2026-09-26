import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingPage from "./index";

vi.mock("../../../components/templates/index/container.base", () => ({
  default: ({ children, title }: { children: ReactNode; title: string }) => (
    <main data-title={title}>{children}</main>
  ),
}));

describe("LandingPage", () => {
  it("renders the landing content inside its page container", () => {
    render(<LandingPage />);

    expect(screen.getByRole("main").getAttribute("data-title")).toBe(
      "LandingPage",
    );
    expect(screen.getByText("LandingPage")).toBeDefined();
  });
});
