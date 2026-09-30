export const TRANSACTION_STATUSES = ["pending", "processing", "done"] as const;
export const TRANSACTION_PAYMENT_METHODS = ["cash", "virtual"] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
export type TransactionPaymentMethod =
  (typeof TRANSACTION_PAYMENT_METHODS)[number];

export type CreateTransactionRequest = {
  order_id: string;
  payment: TransactionPaymentMethod;
  note?: string;
};

export type TransactionRecord = {
  id?: string;
  status?: string;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
  user_id?: { id?: string; username?: string } | string;
  order_id?:
    | (Omit<OrderRecord, "customer_id" | "table_id" | "status"> & {
        customer_id?: { id?: string; username?: string } | string;
        table_id?: { id?: string; name?: string } | string;
        status?: string;
      })
    | string;
  user_username?: string;
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
  user_id: string;
  order_id: string;
  note: string;
};

export const ORDER_PAYMENT_STATUSES = ["pending", "cash", "virtual"] as const;
export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUSES)[number];
export type UpdateOrderStatusRequest = { status: OrderPaymentStatus };

export type OrderMenuSelectionRequest = {
  menu_id: string;
  quality: string;
  note?: string;
};

export type CreateOrderRequest = {
  customer_id: string;
  table_id: string;
  note?: string;
  items: OrderMenuSelectionRequest[];
};

export type UpdateOrderRequest = Omit<CreateOrderRequest, "items"> & {
  items: (OrderMenuSelectionRequest & { note: string })[];
};

export type OrderRecord = {
  id?: string;
  customer_id?: { id?: string; username?: string } | string;
  table_id?: { id?: string; name?: string } | string;
  status?: string;
  estimated_ready_at?: string | number | Date;
  expires_at?: string | number | Date;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
  is_expired?: boolean;
  customer_username?: string;
  table_name?: string;
  categories?: OrderCategoryRecord[];
  items?: OrderItemRecord[];
  [key: string]: unknown;
};

export type OrderCategoryRecord = Pick<CategoryRecord, "id" | "name"> & {
  desc?: string;
  image?: string | null;
  items: OrderItemRecord[];
};

export type OrderItemRecord = {
  id?: string;
  order_id?: string | { id?: string; [key: string]: unknown };
  menu_id?: string | MenuRecord;
  quality?: number | string;
  duration?: number | string;
  promo?: number | string;
  price?: number | string;
  total_price?: number | string;
  note?: string;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
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
  id: string;
  name: string;
  created_at?: unknown;
  updated_at?: unknown;
  [key: string]: unknown;
};

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  roles?: Pick<RoleRecord, "id" | "name">[];
  [key: string]: unknown;
};

export type TableRecord = {
  id: string;
  name: string;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
};

export type CategoryRecord = {
  id: string;
  name: string;
  desc?: string;
  image?: string | null;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
  [field: string]: unknown;
};

export type MenuRecord = {
  id?: string;
  name?: string;
  desc?: string;
  price?: string | number;
  promo?: string | number;
  duration?: string | number;
  image?: string | null;
  category_id?:
    | { id?: string; name?: string; desc?: string; image?: string | null }
    | string
    | null;
  category_name?: string;
  is_available?: boolean;
  is_favorite?: boolean;
  favorite?: boolean;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
  [key: string]: unknown;
};

export type UpdateCustomerRequest = { username: string };
export type CustomerRecord = {
  id?: string;
  username?: string;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
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
  category_id: string;
  is_available: string | boolean;
  is_favorite: string | boolean;
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
  role_ids: string[];
  password: string;
  repeat_password: string;
};

export type UpdateUserRequest = Pick<
  CreateUserRequest,
  "username" | "email" | "role_ids"
> & {
  password?: string;
  repeat_password?: string;
};

export type FavoriteMenuRecord = { id?: string; [key: string]: unknown };

export type FavoriteAnalysis = {
  favorite_menus?: FavoriteMenuRecord[];
  data_set?: unknown[];
  initial_centroids?: unknown[];
  kmeans_data?: unknown[];
  final_menu_clusters?: Record<string, unknown>;
  [key: string]: unknown;
};
