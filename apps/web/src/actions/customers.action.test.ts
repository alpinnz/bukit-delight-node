import { describe, expect, it } from "vitest";
import CustomersAction from "./customers.action";

describe("CustomersAction", () => {
  it("sets the profile returned by authenticated customer login", () => {
    const customer = { id: "customer-1", username: "customer@example.test" };

    expect(CustomersAction.setCustomer(customer)).toEqual({
      type: "CUSTOMERS/SET_CUSTOMER",
      payload: customer,
    });
  });

  it("clears the customer profile on logout", () => {
    expect(CustomersAction.cleanCustomer()).toEqual({
      type: "CUSTOMERS/CLEAN_CUSTOMER",
    });
  });
});
