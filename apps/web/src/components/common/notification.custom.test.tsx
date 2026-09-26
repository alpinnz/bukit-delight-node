import { act, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import Actions from "../../actions";
import RootReducer from "../../reducers";
import NotificationCustom from "./notification.custom";

afterEach(() => {
  vi.useRealTimers();
});

describe("NotificationCustom", () => {
  it("shows API failure notifications to the user", () => {
    const store = createStore(RootReducer);

    render(
      <Provider store={store}>
        <NotificationCustom />
      </Provider>,
    );

    expect(screen.queryByRole("alert")).toBeNull();

    act(() => {
      store.dispatch(
        Actions.Service.pushErrorNotification("Unable to load orders"),
      );
    });

    expect(screen.getByRole("alert").textContent).toContain(
      "Unable to load orders",
    );
  });

  it("hides a notification after six seconds", () => {
    vi.useFakeTimers();
    const store = createStore(RootReducer);

    render(
      <Provider store={store}>
        <NotificationCustom />
      </Provider>,
    );

    act(() => {
      store.dispatch(Actions.Service.pushInfoNotification("Saved"));
    });
    expect(store.getState().Service.notification.open).toBe(true);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(store.getState().Service.notification.open).toBe(false);
  });

  it("does not let an earlier notification timer hide a newer message", () => {
    vi.useFakeTimers();
    const store = createStore(RootReducer);

    render(
      <Provider store={store}>
        <NotificationCustom />
      </Provider>,
    );

    act(() => {
      store.dispatch(Actions.Service.pushInfoNotification("First message"));
      vi.advanceTimersByTime(5000);
    });
    act(() => {
      store.dispatch(Actions.Service.pushSuccessNotification("Second message"));
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(store.getState().Service.notification.open).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(store.getState().Service.notification.open).toBe(false);
  });
});
