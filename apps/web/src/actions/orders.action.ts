import axios from "axios";
import type {
  ApiResponse,
  CreateOrderRequest,
  OrderRecord,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import apiConfig from "../config/api-config";
import Actions from "./";
import type { RootState } from "../reducers";

export const MOUNT = "ORDERS/MOUNT";
export const LOADING = "ORDERS/LOADING";
export const SET_ORDERS = "ORDERS/SET_ORDERS";
export const SET_ORDER = "ORDERS/SET_ORDER";
export const CLEAN_ORDER = "ORDERS/CLEAN_ORDER";
export const DIALOG_PAYMENT_OPEN = "ORDERS/DIALOG_PAYMENT_OPEN";
export const DIALOG_PAYMENT_HIDE = "ORDERS/DIALOG_PAYMENT_HIDE";
export const DIALOG_REVIEW_OPEN = "ORDERS/DIALOG_REVIEW_OPEN";
export const DIALOG_REVIEW_HIDE = "ORDERS/DIALOG_REVIEW_HIDE";

type OrderThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { access_token: string; refresh_token: string };
type OrdersResponse = ApiResponse<OrderRecord[]>;
type CreateOrderInput = { note?: string };

const localGetAccount = (): StoredAccount | null => {
  const account = localStorage.getItem("account");
  return account ? (JSON.parse(account) as StoredAccount) : null;
};

const getHeaders = () => {
  const account = localGetAccount();
  return {
    "x-access-token": account?.access_token ?? "",
    "x-refresh-token": account?.refresh_token ?? "",
  };
};

const errorMessage = (cause: unknown): string => {
  if (
    typeof cause === "object" &&
    cause !== null &&
    "message" in cause &&
    typeof cause.message === "string"
  ) {
    return cause.message;
  }
  return "error";
};

const responseBody = (response: { data: unknown }): OrdersResponse =>
  response.data as OrdersResponse;

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const loadOrders = (isInitialLoad: boolean): OrderThunk => {
  const URL_PATH = "api/v1/orders";
  return (dispatch) => {
    if (isInitialLoad) dispatch(loading(true));
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: apiConfig.baseUrl,
      headers: getHeaders(),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          dispatch(setOrders(body.data));
          setTimeout(() => dispatch(onLoadSelectors()), 1000);
          return;
        }
        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        if (isInitialLoad) dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        if (isInitialLoad) dispatch(loading(false));
      });
  };
};

const onMount = (): OrderThunk => loadOrders(true);
const onLoad = (): OrderThunk => loadOrders(false);

const onLoadSelectors = (): OrderThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const orders = state.Orders;
    const customer = state.Customers.customer;

    if (orders.order?.id) {
      const selectedOrder = orders.data.find(
        ({ id }) => id === orders.order?.id,
      );
      if (selectedOrder) dispatch(setOrder(selectedOrder));
    }

    if (customer?.id) {
      const activeOrder = orders.data.find((order) => {
        const customerId =
          typeof order.customer_id === "object"
            ? order.customer_id?.id
            : undefined;
        return order.is_expired === false && customerId === customer.id;
      });
      if (activeOrder) {
        const table =
          typeof activeOrder.table_id === "object"
            ? activeOrder.table_id
            : undefined;
        if (table?.id && table.name) {
          dispatch(
            Actions.Tables.setTable({
              id: table.id,
              name: table.name,
            }),
          );
        }
        dispatch(Actions.Cart.setOrder(activeOrder));
      } else {
        dispatch(Actions.Cart.cleanOrder());
      }
    }

    setTimeout(() => {
      if (orders.loading) dispatch(loading(false));
      if (!orders.mount) dispatch(mount());
    }, 1000);
  };
};

const onCreate = (input: CreateOrderInput): OrderThunk => {
  const URL_PATH = "api/v1/orders";
  return (dispatch, getState) => {
    dispatch(loading(true));
    const state = getState();
    const customerId = state.Customers.customer?.id;
    const tableId = state.Tables.table?.id;
    if (!customerId || !tableId) {
      dispatch(
        Actions.Service.pushErrorNotification(
          "Customer and table are required",
        ),
      );
      dispatch(loading(false));
      return;
    }

    const orderRequest: CreateOrderRequest = {
      customer_id: customerId,
      table_id: tableId,
      ...(input.note ? { note: input.note } : {}),
      items: state.Cart.data.map((item) => ({
        menu_id: String(item.menu.id ?? ""),
        quality: String(item.quality),
        ...(item.note ? { note: item.note } : {}),
      })),
    };
    const formData = new FormData();
    formData.append("customer_id", orderRequest.customer_id);
    formData.append("table_id", orderRequest.table_id);
    if (orderRequest.note) formData.append("note", orderRequest.note);
    orderRequest.items.forEach((item, index) => {
      formData.append(`items[${index}][menu_id]`, item.menu_id);
      formData.append(`items[${index}][quality]`, item.quality);
      if (item.note) formData.append(`items[${index}][note]`, item.note);
    });

    axios({
      method: "POST",
      url: URL_PATH,
      baseURL: apiConfig.baseUrl,
      data: formData,
      headers: getHeaders(),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification("Create Orders"));
          dispatch(Actions.Cart.onClean());
          dispatch(Actions.Cart.dialogPaymentHide());
          dispatch(loading(false));
          return;
        }
        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        dispatch(loading(false));
      });
  };
};

const setOrders = (orders: OrderRecord[]) => ({
  type: SET_ORDERS,
  payload: orders,
});
const setOrder = (order: OrderRecord) => ({ type: SET_ORDER, payload: order });
const cleanOrder = () => ({ type: CLEAN_ORDER });
const openDialogPayment = () => ({ type: DIALOG_PAYMENT_OPEN });
const hideDialogPayment = () => ({ type: DIALOG_PAYMENT_HIDE });
const openDialogReview = () => ({ type: DIALOG_REVIEW_OPEN });
const hideDialogReview = () => ({ type: DIALOG_REVIEW_HIDE });

const OrdersAction = {
  onMount,
  onLoad,
  onCreate,
  setOrder,
  cleanOrder,
  openDialogPayment,
  hideDialogPayment,
  openDialogReview,
  hideDialogReview,
};

export default OrdersAction;
