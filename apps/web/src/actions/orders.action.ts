import axios from "axios";
import type {
  ApiResponse,
  CreateOrderRequest,
  OrderRecord,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
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
type StoredAccount = { accessToken: string; refreshToken: string };
type OrdersResponse = ApiResponse<OrderRecord[]>;
type CreateOrderInput = { note?: string };

const localGetAccount = (): StoredAccount | null => {
  const account = localStorage.getItem("account");
  return account ? (JSON.parse(account) as StoredAccount) : null;
};

const getHeaders = () => {
  const account = localGetAccount();
  return {
    "x-access-token": account?.accessToken ?? "",
    "x-refresh-token": account?.refreshToken ?? "",
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
      baseURL: Const.BASE_URL,
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

    if (orders.order?._id) {
      const selectedOrder = orders.data.find(
        ({ _id }) => _id === orders.order?._id,
      );
      if (selectedOrder) dispatch(setOrder(selectedOrder));
    }

    if (customer?._id) {
      const activeOrder = orders.data.find((order) => {
        const customerId =
          typeof order.id_customer === "object"
            ? order.id_customer?._id
            : undefined;
        return order.isExpired === false && customerId === customer._id;
      });
      if (activeOrder) {
        const table =
          typeof activeOrder.id_table === "object"
            ? activeOrder.id_table
            : undefined;
        if (table?._id && table.name) {
          dispatch(
            Actions.Tables.setTable({
              _id: table._id,
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
    const customerId = state.Customers.customer?._id;
    const tableId = state.Tables.table?._id;
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
      id_customer: customerId,
      id_table: tableId,
      ...(input.note ? { note: input.note } : {}),
      Menus: state.Cart.data.map((item) => ({
        id_menu: String(item.menu._id ?? ""),
        quality: String(item.quality),
        ...(item.note ? { note: item.note } : {}),
      })),
    };
    const formData = new FormData();
    formData.append("id_customer", orderRequest.id_customer);
    formData.append("id_table", orderRequest.id_table);
    if (orderRequest.note) formData.append("note", orderRequest.note);
    orderRequest.Menus.forEach((item, index) => {
      formData.append(`Menus[${index}][id_menu]`, item.id_menu);
      formData.append(`Menus[${index}][quality]`, item.quality);
      if (item.note) formData.append(`Menus[${index}][note]`, item.note);
    });

    axios({
      method: "POST",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
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
