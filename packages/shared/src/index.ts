export const TRANSACTION_STATUSES = ["pending", "processing", "done"] as const;
export const TRANSACTION_PAYMENT_METHODS = ["cash", "virtual"] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
export type TransactionPaymentMethod =
  (typeof TRANSACTION_PAYMENT_METHODS)[number];

export type CreateTransactionRequest = {
  id_order: string;
  payment: TransactionPaymentMethod;
  id_account?: string;
  note?: string;
};
export type TransactionRecord = {
  _id?: string;
  status?: string;
  createdAt?: string | number | Date;
  id_account?: { _id?: string; username?: string } | string;
  id_order?:
    | (Omit<OrderRecord, "id_customer" | "id_table" | "status"> & {
        id_customer?: { _id?: string; username?: string } | string;
        id_table?: { _id?: string; name?: string } | string;
        status?: string;
      })
    | string;
  account_id?: string;
  account_username?: string;
  order_customer_id?: string;
  order_customer_username?: string;
  order_table_id?: string;
  order_table_name?: string;
  order_quality?: unknown;
  order_promo?: unknown;
  order_price?: unknown;
  order_total_price?: unknown;
  order_status?: string;
  [key: string]: unknown;
};

export type UpdateTransactionStatusRequest = {
  status: TransactionStatus;
};

export type UpdateTransactionRequest = UpdateTransactionStatusRequest & {
  id_account: string;
  id_order: string;
  note: string;
};

export const ORDER_PAYMENT_STATUSES = ["pending", "cash", "virtual"] as const;
export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUSES)[number];
export type UpdateOrderStatusRequest = { status: OrderPaymentStatus };

export type OrderMenuSelectionRequest = {
  id_menu: string;
  quality: string;
  note?: string;
};

export type CreateOrderRequest = {
  id_customer: string;
  id_table: string;
  note?: string;
  Menus: OrderMenuSelectionRequest[];
};

export type UpdateOrderRequest = Omit<CreateOrderRequest, "Menus"> & {
  Menus: (OrderMenuSelectionRequest & { note: string })[];
};
export type OrderRecord = {
  _id?: string;
  id_customer?: { _id?: string; username?: string } | string;
  id_table?: { _id?: string; name?: string } | string;
  status?: string;
  estimatedReadyAt?: string | number | Date;
  customer_username?: string;
  table_name?: string;
  categories?: OrderCategoryRecord[];
  itemOrder?: ItemOrderRecord[];
  [key: string]: unknown;
};
export type OrderCategoryRecord = Pick<CategoryRecord, "_id" | "name"> & {
  desc?: string;
  image?: string | null;
  itemOrders: ItemOrderRecord[];
};
export type ItemOrderRecord = {
  _id?: string;
  id_order?: string | { _id?: string; [key: string]: unknown };
  id_menu?: string | MenuRecord;
  quality?: number | string;
  duration?: number | string;
  promo?: number | string;
  price?: number | string;
  total_price?: number | string;
  note?: string;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
  [key: string]: unknown;
};

export type ApiResponse<T = unknown> = {
  success?: boolean;
  name?: string;
  message?: string;
  code?: string | number;
  status?: number;
  data?: T;
  error?: { code: string; message: string };
};

export type RoleRecord = {
  _id: string;
  name: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
};
export type UserRecord = {
  _id: string;
  username: string;
  email: string;
  id_roles?: Pick<RoleRecord, "_id" | "name">[];
  [key: string]: unknown;
};
export type TableRecord = { _id: string; name: string };
export type CategoryRecord = {
  _id: string;
  name: string;
  desc?: string;
  image?: string | null;
  [field: string]: unknown;
};
export type MenuRecord = {
  _id?: string;
  name?: string;
  desc?: string;
  price?: string | number;
  promo?: string | number;
  image?: string | null;
  id_category?:
    | { _id?: string; name?: string; desc?: string; image?: string | null }
    | string
    | null;
  category_id?: string;
  category_name?: string;
  [key: string]: unknown;
};

export type UpdateCustomerRequest = { username: string };
export type CustomerRecord = {
  _id?: string;
  username?: string;
  [key: string]: unknown;
};
export type CreateTableRequest = { name: string };
export type UpdateTableRequest = { name: string };
export type CreateCategoryRequest = { name: string; desc: string };
export type UpdateCategoryRequest = { name: string; desc: string };
export type MenuRequestFields = {
  name: string;
  desc: string;
  price: string | number;
  duration: string | number;
  id_category: string;
  isAvailable: string | boolean;
  isFavorite: string | boolean;
};
export type CreateMenuRequest = MenuRequestFields & {
  promo?: string | number;
};
export type UpdateMenuRequest = MenuRequestFields & {
  promo: string | number;
};
export type CreateUserRequest = {
  username: string;
  email: string;
  id_roles: string[];
  password: string;
  repeat_password: string;
};
export type UpdateUserRequest = Pick<
  CreateUserRequest,
  "username" | "email" | "id_roles"
> & {
  password?: string;
  repeat_password?: string;
};

export type FavoriteMenuRecord = { _id?: string; [key: string]: unknown };
export type FavoriteAnalysis = {
  menu_favorit?: FavoriteMenuRecord[];
  DataSet?: unknown[];
  c_awal?: unknown[];
  data_kmeans?: unknown[];
  menu_cluster_akhir?: Record<string, unknown>;
  [key: string]: unknown;
};
