import { describe, expect, it } from "vitest";
import Convert from "./convert";

describe("display formatting", () => {
  it("capitalizes names consistently", () => {
    expect(Convert.Capitals("bUKIT delight")).toBe("Bukit delight");
  });

  it("formats Indonesian rupiah with dot separators", () => {
    expect(Convert.RpIndonesia(1234567)).toBe("Rp 1.234.567");
  });

  it("abbreviates large prices in thousands", () => {
    expect(Convert.Price(1500)).toBe("1.5k");
  });
});
