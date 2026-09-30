import { describe, expect, it } from "vitest";
import ServiceAction from "../actions/service.action";
import ServiceReducer from "./service.reducer";

describe("ServiceReducer", () => {
  it("opens and clears notification state", () => {
    const initialState = ServiceReducer(undefined, { type: "init" });
    const openState = ServiceReducer(
      initialState,
      ServiceAction.pushErrorNotification("Request failed"),
    );

    expect(openState.notification).toEqual({
      open: true,
      message: "Request failed",
      type: "error",
    });
    expect(
      ServiceReducer(openState, ServiceAction.hideNotification()).notification,
    ).toEqual({ open: false, message: "", type: "" });
  });

  it("opens and clears form dialog state without changing other service state", () => {
    const initialState = ServiceReducer(undefined, { type: "init" });
    const row = { id: "menu-1", name: "Iced Tea" };
    const openState = ServiceReducer(
      initialState,
      ServiceAction.openFormDialog("update", row),
    );

    expect(openState.form_dialog).toEqual({ open: true, type: "update", row });

    const closedState = ServiceReducer(
      openState,
      ServiceAction.hideFormDialog(),
    );
    expect(closedState.form_dialog).toEqual({ open: false, type: "", row: {} });
    expect(closedState.dialog_payment).toBe(initialState.dialog_payment);
    expect(closedState.dialog_review).toBe(initialState.dialog_review);
  });
});
