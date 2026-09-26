import { describe, expect, it } from "vitest";
import {
  CLEAN_CUSTOMER,
  LOADING,
  MOUNT,
  SET_CUSTOMER,
  SET_CUSTOMERS,
} from "../actions/customers.action";
import CustomersReducer from "./customers.reducer";

describe("CustomersReducer", () => {
  it("starts without loaded customers or a selected customer", () => {
    expect(CustomersReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      data: [],
      customer: null,
    });
  });

  it("tracks mount and loading transitions", () => {
    const mounted = CustomersReducer(undefined, { type: MOUNT });
    expect(mounted.mount).toBe(true);
    expect(CustomersReducer(mounted, { type: LOADING, payload: true })).toEqual(
      { ...mounted, loading: true },
    );
  });

  it("stores loaded customer records and clears loading", () => {
    const customers = [{ _id: "customer-1", username: "guest" }];
    expect(
      CustomersReducer(
        { mount: false, loading: true, data: [], customer: null },
        { type: SET_CUSTOMERS, payload: customers },
      ),
    ).toEqual({
      mount: false,
      loading: false,
      data: customers,
      customer: null,
    });
  });

  it("sets and cleans the active customer", () => {
    const customer = { _id: "customer-1", username: "guest" };
    const selected = CustomersReducer(undefined, {
      type: SET_CUSTOMER,
      payload: customer,
    });
    expect(selected.customer).toEqual(customer);
    expect(selected.loading).toBe(false);
    expect(
      CustomersReducer(selected, { type: CLEAN_CUSTOMER }).customer,
    ).toBeNull();
  });
});
