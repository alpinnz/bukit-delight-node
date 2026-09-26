import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CountdownCustom from "./countdown.custom";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("CountdownCustom", () => {
  it("shows the remaining minutes and seconds and updates every second", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-26T12:00:00.000Z"));
    render(<CountdownCustom date="2026-09-26T12:01:01.000Z" />);

    expect(screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent)).toEqual([
      "1",
      ":",
      "1",
    ]);
    vi.advanceTimersByTime(1000);
    expect(screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent)).toEqual([
      "1",
      ":",
      "0",
    ]);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("shows placeholders without a date and clears its timer on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<CountdownCustom />);

    expect(screen.getAllByText("--")).toHaveLength(2);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
