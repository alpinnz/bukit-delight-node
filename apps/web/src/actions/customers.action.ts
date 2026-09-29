import type { CustomerRecord } from "@bukit-delight/shared";

export const SET_CUSTOMER = "CUSTOMERS/SET_CUSTOMER";
export const CLEAN_CUSTOMER = "CUSTOMERS/CLEAN_CUSTOMER";

const setCustomer = (customer: CustomerRecord) => ({
  type: SET_CUSTOMER,
  payload: customer,
});

const cleanCustomer = () => ({ type: CLEAN_CUSTOMER });

const CustomersAction = { setCustomer, cleanCustomer };

export default CustomersAction;
