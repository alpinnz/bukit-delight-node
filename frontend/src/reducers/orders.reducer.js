import {
  MOUNT,
  LOADING,
  SET_ORDERS,
  CLEAN_ORDER,
  SET_ORDER,
  DIALOG_PAYMENT_HIDE,
  DIALOG_PAYMENT_OPEN,
  DIALOG_REVIEW_HIDE,
  DIALOG_REVIEW_OPEN,
} from "./../actions/orders.action";

const initialState = {
  mount: false,
  loading: false,
  order: null,
  data: [],
  dialog_payment: { open: false },
  dialog_review: { open: false },
};

const OrdersReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ORDERS) {
    const data = action.payload.map((e) => {
      e["customer_username"] = e["id_customer"]["username"];
      e["table_name"] = e["id_table"]["name"];
      return e;
    });

    return {
      ...state,
      data: data,
    };
  }

  if (action.type === SET_ORDER) {
    return {
      ...state,
      loading: false,
      order: action.payload,
    };
  }

  if (action.type === CLEAN_ORDER) {
    return {
      ...state,
      loading: false,
      order: null,
    };
  }

  if (action.type === DIALOG_PAYMENT_OPEN) {
    return {
      ...state,
      dialog_payment: { open: true },
    };
  }
  if (action.type === DIALOG_PAYMENT_HIDE) {
    return {
      ...state,
      dialog_payment: { open: false },
    };
  }

  if (action.type === DIALOG_REVIEW_OPEN) {
    return {
      ...state,
      dialog_review: { open: true },
    };
  }
  if (action.type === DIALOG_REVIEW_HIDE) {
    return {
      ...state,
      dialog_review: { open: false },
    };
  }
  return state;
};
export default OrdersReducer;
