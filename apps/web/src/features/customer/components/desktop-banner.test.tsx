import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CustomerDesktopBanner from "./desktop-banner";

vi.mock("../../../components/organisms/image-carousel", () => ({
  default: ({ height, data }: { height: string; data: string[] }) => (
    <div>{`slide-${height}-${data.join(",")}`}</div>
  ),
}));
vi.mock("../../../assets/images", () => ({
  default: {
    banner_1: "banner-1",
    banner_2: "banner-2",
    banner_3: "banner-3",
    banner_4: "banner-4",
    banner_5: "banner-5",
    banner_6: "banner-6",
  },
}));

describe("CustomerDesktopBanner", () => {
  it("shows all six customer banners in the desktop slideshow", () => {
    render(<CustomerDesktopBanner />);

    expect(
      screen.getByText(
        "slide-15vh-banner-1,banner-2,banner-3,banner-4,banner-5,banner-6",
      ),
    ).toBeDefined();
  });
});
