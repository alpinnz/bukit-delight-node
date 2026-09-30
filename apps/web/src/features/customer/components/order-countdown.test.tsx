import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OrderCountdown from "./order-countdown";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("OrderCountdown", () => {
  it("shows the remaining minutes and seconds and updates every second", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-26T12:00:00.000Z"));
    render(<OrderCountdown date="2026-09-26T12:01:01.000Z" />);
    const timer = screen.getByRole("timer", { name: "Waktu tersisa" });
    const getDisplayedTime = () =>
      Array.from(timer.querySelectorAll("span"), (node) => node.textContent);

    expect(getDisplayedTime()).toEqual(["1", ":", "1"]);
    act(() => vi.advanceTimersByTime(1000));
    expect(getDisplayedTime()).toEqual(["1", ":", "0"]);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("shows placeholders without a date and clears its timer on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<OrderCountdown />);

    expect(screen.getAllByText("--")).toHaveLength(2);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
