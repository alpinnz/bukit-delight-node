import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import {
  type CreateOrderRequest,
  type OrderItemRecord,
  type OrderRecord,
  ORDER_PAYMENT_STATUSES,
  type OrderPaymentStatus,
  type UpdateOrderRequest,
  type UpdateOrderStatusRequest,
} from "@bukit-delight/shared";

const Joi = require("joi");
const { response } = require("../middlewares");
const { prisma } = require("../config/prisma");
const logger = require("../utils/logger");
const {
  createOrder,
  deleteOrder,
  findOrderById,
  listOrders,
  updateOrder,
  updateOrderStatus,
} = require("../services/orders.service");

type OrderRequest = Request & {
  auth?: { userId?: string; roles?: string[] };
  app: Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
};

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

const requirePrisma = () => {
  if (!prisma) throw error("PostgreSQL order storage is not configured");
  return prisma;
};

const sendError = (cause: unknown, next: NextFunction) => {
  const status = (cause as { status?: number })?.status;
  if (status && status < 500) {
    return next(error(String((cause as Error).message), status));
  }
  const code = (cause as { code?: string })?.code;
  if (code === "P2025") return next(error("Order not found", 404));
  logger.error({ err: cause }, "Prisma order operation failed");
  return next(error("Order request failed"));
};

const emitOrdersUpdate = (req: OrderRequest) =>
  req.app.io.emit("OrdersUpdate", "OrdersUpdate");

const imageUrl = (image?: string | null) =>
  image != null
    ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${image}`
    : null;

const orderItemOutput = (item: any): OrderItemRecord => ({
  id: item.id,
  order_id: item.order_id,
  menu_id: {
    id: item.menu.id,
    name: item.menu.name,
    desc: item.menu.desc,
    price: item.menu.price,
    promo: item.menu.promo,
    duration: item.menu.duration,
    category_id: item.menu.category_id,
    image: imageUrl(item.menu.image),
  },
  quality: item.quality,
  duration: item.duration,
  promo: item.promo,
  price: item.price,
  total_price: item.total_price,
  note: item.note,
  created_at: item.created_at,
  updated_at: item.updated_at,
});

const orderOutput = (order: any, includeCategories: boolean): OrderRecord => {
  const items = order.items ?? [];
  const categoryItems = new Map<string, { category: any; items: any[] }>();
  for (const item of items) {
    const category = item.menu.category;
    const grouped = categoryItems.get(category.id) ?? {
      category,
      items: [],
    };
    grouped.items.push(orderItemOutput(item));
    categoryItems.set(category.id, grouped);
  }

  const output: Record<string, unknown> = {
    id: order.id,
    customer_id: order.customer
      ? { id: order.customer.id, username: order.customer.username }
      : order.customer_id,
    table_id: order.table
      ? { id: order.table.id, name: order.table.name }
      : order.table_id,
    quality: order.quality,
    duration: order.duration,
    promo: order.promo,
    price: order.price,
    total_price: order.total_price,
    note: order.note,
    status: order.status.toLowerCase(),
    estimated_ready_at: order.estimated_ready_at,
    expires_at: order.expires_at,
    is_expired:
      Date.now() >= new Date(order.expires_at).getTime() ||
      order.status === "CASH" ||
      order.status === "VIRTUAL",
    created_at: order.created_at,
    updated_at: order.updated_at,
  };

  if (includeCategories) {
    output.categories = [...categoryItems.values()].map(
      ({ category, items }) => ({
        id: category.id,
        name: category.name,
        desc: category.desc,
        image: imageUrl(category.image),
        items,
      }),
    );
  }
  if (order.items) output.items = items.map(orderItemOutput);
  return output;
};

exports.serializeOrder = orderOutput;

const menuSelection = Joi.object({
  menu_id: Joi.string().required(),
  quality: Joi.string().required(),
  note: Joi.string(),
});

const orderSchema = Joi.object({
  customer_id: Joi.string().required(),
  table_id: Joi.string().required(),
  note: Joi.string(),
  items: Joi.array().items(menuSelection).required(),
});

const validate = (schema: unknown, req: Request, next: NextFunction) => {
  const { error: validationError, value } = (schema as any).validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return value;
};

const toWrite = (body: any) => ({
  customer_id: body.customer_id,
  table_id: body.table_id,
  note: body.note,
  menus: body.items.map((menu: any) => ({
    id: menu.menu_id,
    quality: menu.quality,
    note: menu.note,
  })),
  expiresAt: new Date(Date.now() + Number(process.env.ORDERS_TIMEOUT)),
});

exports.readAll = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const orders = await listOrders(
      requirePrisma(),
      !req.auth?.roles?.some((role) => ["cashier", "owner"].includes(role))
        ? req.auth?.userId
        : undefined,
    );
    return response.success(
      res,
      "ReadAll",
      0,
      200,
      orders.map((order: any) => orderOutput(order, true)),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.readOne = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const order = await findOrderById(requirePrisma(), req.params.id);
    if (
      !order ||
      (!req.auth?.roles?.some((role) => ["cashier", "owner"].includes(role)) &&
        order.customer_id !== req.auth?.userId)
    ) {
      return next(error("load order failed", 404));
    }
    return response.success(res, "ReadOne", 0, 200, orderOutput(order, true));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.create = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(orderSchema, req, next) as CreateOrderRequest | null;
  if (!body) return;
  try {
    if (req.auth?.roles?.includes("customer")) {
      if (!req.auth.userId) {
        return next(error("Customer identity is missing", 401));
      }
      body.customer_id = req.auth.userId;
    }
    const order = await createOrder(requirePrisma(), toWrite(body));
    if (!order) return next(error("Create failed"));
    emitOrdersUpdate(req);
    return response.success(res, "Create", 0, 200, orderOutput(order, false));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.update = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    orderSchema.keys({
      items: Joi.array()
        .items(menuSelection.keys({ note: Joi.string().required() }))
        .required(),
    }),
    req,
    next,
  ) as UpdateOrderRequest | null;
  if (!body) return;
  try {
    const order = await updateOrder(
      requirePrisma(),
      req.params.id,
      toWrite(body),
    );
    if (!order) return next(error("Orders not found", 404));
    emitOrdersUpdate(req);
    return response.success(res, "Update", 0, 200, orderOutput(order, true));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.updateStatus = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      status: Joi.string()
        .valid(...ORDER_PAYMENT_STATUSES)
        .required(),
    }),
    req,
    next,
  );
  if (!body) return;
  try {
    const request = body as UpdateOrderStatusRequest;
    const status =
      request.status.toUpperCase() as Uppercase<OrderPaymentStatus>;
    const order = await updateOrderStatus(
      requirePrisma(),
      req.params.id,
      status,
    );
    if (!order) return next(error("order not found", 404));
    emitOrdersUpdate(req);
    return response.success(
      res,
      "OrdersUpdateStatus",
      0,
      200,
      orderOutput(order, false),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.delete = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const order = await deleteOrder(requirePrisma(), req.params.id);
    emitOrdersUpdate(req);
    return response.success(res, "Delete", 0, 200, orderOutput(order, false));
  } catch (cause) {
    return sendError(cause, next);
  }
};
