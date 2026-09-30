import { describe, expect, it } from "vitest";
import {
  CLEAN_CUSTOMER,
  SET_CUSTOMER,
} from "../actions/customers.action";
import CustomersReducer from "./customers.reducer";

describe("CustomersReducer", () => {
  it("starts without an authenticated customer", () => {
    expect(CustomersReducer(undefined, { type: "@@init" })).toEqual({
      customer: null,
    });
  });

  it("stores and clears the authenticated customer profile", () => {
    const customer = { id: "customer-1", username: "customer@example.test" };
    const selected = CustomersReducer(undefined, {
      type: SET_CUSTOMER,
      payload: customer,
    });

    expect(selected.customer).toEqual(customer);
    expect(
      CustomersReducer(selected, { type: CLEAN_CUSTOMER }).customer,
    ).toBeNull();
  });
});
