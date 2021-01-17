import {
  MOUNT,
  LOADING,
  SET_CUSTOMERS,
  CLEAN_CUSTOMER,
  SET_CUSTOMER,
} from "./../actions/customers.action";

const initialState = {
  mount: false,
  loading: false,
  data: [],
  customer: null,
};

const CustomersReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_CUSTOMERS) {
    return {
      ...state,

      loading: false,
      data: action.payload,
    };
  }
  if (action.type === SET_CUSTOMER) {
    return {
      ...state,
      loading: false,
      customer: action.payload,
    };
  }
  if (action.type === CLEAN_CUSTOMER) {
    return {
      ...state,
      loading: false,
      customer: null,
    };
  }

  return state;
};
export default CustomersReducer;
