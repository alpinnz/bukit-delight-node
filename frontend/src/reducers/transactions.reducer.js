import {
  MOUNT,
  LOADING,
  SET_TRANSACTIONS,
  CLEAN_TRANSACTION,
  SET_TRANSACTION,
  DIALOG_REVIEW_OPEN,
  DIALOG_REVIEW_HIDE,
  DIALOG_STATUS_HIDE,
  DIALOG_STATUS_OPEN,
} from "./../actions/transactions.action";

const initialState = {
  mount: false,
  loading: false,
  transaction: null,
  data: [],
  dialog_review: { open: false },
  dialog_status: { open: false },
};

const TransactionsReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }

  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_TRANSACTIONS) {
    const data = action.payload.map((e) => {
      e["account_id"] = e["id_account"]["_id"];
      e["account_username"] = e["id_account"]["username"];
      e["order_customer_id"] = e["id_order"]["id_customer"]["_id"];
      e["order_customer_username"] = e["id_order"]["id_customer"]["username"];
      e["order_table_id"] = e["id_order"]["id_table"]["_id"];
      e["order_table_name"] = e["id_order"]["id_table"]["name"];
      e["order_quality"] = e["id_order"]["quality"];
      e["order_promo"] = e["id_order"]["promo"];
      e["order_price"] = e["id_order"]["price"];
      e["order_total_price"] = e["id_order"]["total_price"];
      e["order_status"] = e["id_order"]["status"];
      return e;
    });
    return {
      ...state,
      mount: true,
      loading: false,
      data: data,
    };
  }

  if (action.type === SET_TRANSACTION) {
    return {
      ...state,
      loading: false,
      transaction: action.payload,
    };
  }

  if (action.type === CLEAN_TRANSACTION) {
    return {
      ...state,
      loading: false,
      transaction: null,
    };
  }

  if (action.type === DIALOG_STATUS_OPEN) {
    return {
      ...state,
      dialog_status: { open: true },
    };
  }
  if (action.type === DIALOG_STATUS_HIDE) {
    return {
      ...state,
      dialog_status: { open: false },
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
export default TransactionsReducer;
