import type { AnyAction } from "redux";
import type { CustomerRecord } from "@bukit-delight/shared";
import {
  CLEAN_CUSTOMER,
  SET_CUSTOMER,
} from "../actions/customers.action";

export type { CustomerRecord } from "@bukit-delight/shared";

export type CustomersState = {
  customer: CustomerRecord | null;
};

const initialState: CustomersState = { customer: null };

const CustomersReducer = (
  state: CustomersState = initialState,
  action: AnyAction,
): CustomersState => {
  if (action.type === SET_CUSTOMER) {
    return { customer: action.payload as CustomerRecord };
  }
  if (action.type === CLEAN_CUSTOMER) return { customer: null };
  return state;
};

export default CustomersReducer;
