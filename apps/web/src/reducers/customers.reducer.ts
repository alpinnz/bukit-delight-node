import type { AnyAction } from "redux";
import type { CustomerRecord } from "@bukit-delight/shared";
import {
  CLEAN_CUSTOMER,
  LOADING,
  MOUNT,
  SET_CUSTOMER,
  SET_CUSTOMERS,
} from "../actions/customers.action";

export type { CustomerRecord } from "@bukit-delight/shared";

export type CustomersState = {
  mount: boolean;
  loading: boolean;
  data: CustomerRecord[];
  customer: CustomerRecord | null;
};

const initialState: CustomersState = {
  mount: false,
  loading: false,
  data: [],
  customer: null,
};

const CustomersReducer = (
  state: CustomersState = initialState,
  action: AnyAction,
): CustomersState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_CUSTOMERS) {
    return {
      ...state,
      loading: false,
      data: action.payload as CustomerRecord[],
    };
  }
  if (action.type === SET_CUSTOMER) {
    return {
      ...state,
      loading: false,
      customer: action.payload as CustomerRecord,
    };
  }
  if (action.type === CLEAN_CUSTOMER) {
    return { ...state, loading: false, customer: null };
  }
  return state;
};

export default CustomersReducer;
