import axios from "axios";
import type {
  ApiResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerRecord,
  UpdateCustomerRequest,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";
import type { RootState } from "../reducers";

export const MOUNT = "CUSTOMERS/MOUNT";
export const LOADING = "CUSTOMERS/LOADING";
export const SET_CUSTOMERS = "CUSTOMERS/SET_CUSTOMERS";
export const SET_CUSTOMER = "CUSTOMERS/SET_CUSTOMER";
export const CLEAN_CUSTOMER = "CUSTOMERS/CLEAN_CUSTOMER";

type CustomerThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { accessToken: string; refreshToken: string };
type StoredCustomer = CustomerRecord & { accessToken?: string };
type CustomersResponse = ApiResponse<CustomerRecord[]>;
type CustomerForm = Partial<CreateCustomerRequest>;

const localGetAccount = (): StoredAccount | null => {
  const account = localStorage.getItem("account");
  return account ? (JSON.parse(account) as StoredAccount) : null;
};

const localGetCustomer = (): StoredCustomer | null => {
  const customer = localStorage.getItem("customer");
  return customer ? (JSON.parse(customer) as StoredCustomer) : null;
};

const localSetCustomer = (customer: StoredCustomer): void => {
  localStorage.setItem("customer", JSON.stringify(customer));
};

const requestHeaders = () => {
  const account = localGetAccount();
  const customer = localGetCustomer();
  return {
    "x-api-key": Const.X_API_KEY,
    "x-app-key": Const.X_APP_KEY,
    "x-access-token": account?.accessToken ?? customer?.accessToken ?? "",
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

const responseBody = <T>(response: { data: unknown }): ApiResponse<T> =>
  response.data as ApiResponse<T>;

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const loadCustomers = (isInitialLoad: boolean): CustomerThunk => {
  const URL_PATH = "api/v1/customers";
  return (dispatch) => {
    if (!isInitialLoad) dispatch(loading(true));
    const storedCustomer = localGetCustomer();
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = responseBody<CustomerRecord[]>(
          response,
        ) as CustomersResponse;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!Array.isArray(body.data)) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          const customers = body.data as CustomerRecord[];
          dispatch(setCustomers(customers));
          if (storedCustomer?._id) {
            const customer = customers.find(
              ({ _id }) => _id === storedCustomer._id,
            );
            if (customer) dispatch(setCustomer(customer));
            else dispatch(cleanCustomer());
          }
          if (isInitialLoad) setTimeout(() => dispatch(mount()), 2000);
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

const onMount = (): CustomerThunk => loadCustomers(true);
const onLoad = (): CustomerThunk => loadCustomers(false);

const onLoadSelectors = (): CustomerThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const selectedCustomer = state.Customers.customer;
    if (!selectedCustomer?._id) return;
    const customer = state.Customers.data.find(
      ({ _id }) => _id === selectedCustomer._id,
    );
    if (customer) dispatch(setCustomer(customer));
  };
};

const onCreate = (input: CustomerForm): CustomerThunk => {
  const URL_PATH = "api/v1/customers";
  return (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    const request: CreateCustomerRequest = {
      username: input.username ?? "",
    };
    formData.append("username", request.username);

    axios({
      method: "POST",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = responseBody<CreateCustomerResponse>(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data || typeof body.data !== "object") {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          const customer = body.data as StoredCustomer;
          localSetCustomer(customer);
          dispatch(setCustomer(customer));
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

const saveCustomer = (
  method: "PUT" | "DELETE",
  id: string,
  input?: CustomerForm,
): CustomerThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    let data: FormData | undefined;
    if (method === "PUT") {
      data = new FormData();
      const request: UpdateCustomerRequest = {
        username: input?.username ?? "",
      };
      data.append("username", request.username);
    }
    axios({
      method,
      url: `api/v1/customers/${id}`,
      baseURL: Const.BASE_URL,
      data,
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(
            Actions.Service.pushSuccessNotification(
              method === "PUT" ? "Update Customers" : "Delete Customers",
            ),
          );
          dispatch(Actions.Service.hideFormDialog());
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

const onUpdate = (id: string | undefined, input: CustomerForm): CustomerThunk =>
  saveCustomer("PUT", String(id), input);
const onDelete = (id: string): CustomerThunk => saveCustomer("DELETE", id);

const setCustomers = (customers: CustomerRecord[]) => ({
  type: SET_CUSTOMERS,
  payload: customers,
});
const setCustomer = (customer: CustomerRecord) => ({
  type: SET_CUSTOMER,
  payload: customer,
});
const cleanCustomer = () => ({ type: CLEAN_CUSTOMER });

const CustomersAction = {
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
  setCustomer,
  cleanCustomer,
  onMount,
};

export default CustomersAction;
