import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import useNetwork from "./use.network";

const NetworkStatus = () => {
  const isOnline = useNetwork();
  return <span>{isOnline ? "Online" : "Offline"}</span>;
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useNetwork", () => {
  it("tracks browser online and offline events", () => {
    const onlineStatus = vi.spyOn(window.navigator, "onLine", "get");
    onlineStatus.mockReturnValue(true);

    render(<NetworkStatus />);
    expect(screen.getByText("Online")).toBeTruthy();

    onlineStatus.mockReturnValue(false);
    fireEvent(window, new Event("offline"));
    expect(screen.getByText("Offline")).toBeTruthy();

    onlineStatus.mockReturnValue(true);
    fireEvent(window, new Event("online"));
    expect(screen.getByText("Online")).toBeTruthy();
  });
});
