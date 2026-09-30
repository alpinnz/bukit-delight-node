import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ImageCarousel from "./image-carousel";

vi.mock("react-slideshow-image", () => ({
  Fade: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

describe("ImageCarousel", () => {
  it("renders each banner with the requested height", () => {
    render(
      <ImageCarousel data={["banner-a.jpg", "banner-b.jpg"]} height="15vh" />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(2);
    const firstBanner = screen.getByRole("img", { name: "0" });
    expect((firstBanner as HTMLImageElement).style.height).toBe("15vh");
    expect(firstBanner.getAttribute("loading")).toBe("eager");
    expect(firstBanner.getAttribute("decoding")).toBe("async");
    expect(screen.getByRole("img", { name: "1" }).getAttribute("loading")).toBe(
      "lazy",
    );
  });
});
