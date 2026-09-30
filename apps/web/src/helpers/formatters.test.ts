import { describe, expect, it } from "vitest";
import formatters from "./formatters";

describe("display formatting", () => {
  it("capitalizes names consistently", () => {
    expect(formatters.capitalizeText("bUKIT delight")).toBe("Bukit delight");
  });

  it("formats Indonesian rupiah with dot separators", () => {
    expect(formatters.formatIndonesianRupiah(1234567)).toBe("Rp 1.234.567");
  });

  it("abbreviates large prices in thousands", () => {
    expect(formatters.formatCompactPrice(1500)).toBe("1.5k");
  });
});
