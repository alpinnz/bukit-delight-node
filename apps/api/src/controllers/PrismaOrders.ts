import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import {
  type CreateOrderRequest,
  type ItemOrderRecord,
  type OrderRecord,
  ORDER_PAYMENT_STATUSES,
  type OrderPaymentStatus,
  type UpdateOrderRequest,
  type UpdateOrderStatusRequest,
} from "@bukit-delight/shared";

const Joi = require("joi");
const { Response } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const {
  createOrder,
  deleteOrder,
  findOrderById,
  listOrders,
  updateOrder,
  updateOrderStatus,
} = require("./../services/PrismaOrders");

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

const itemOutput = (item: any): ItemOrderRecord => ({
  _id: item.id,
  id_order: item.orderId,
  id_menu: {
    _id: item.menu.id,
    name: item.menu.name,
    desc: item.menu.desc,
    price: item.menu.price,
    promo: item.menu.promo,
    duration: item.menu.duration,
    id_category: item.menu.categoryId,
    image: imageUrl(item.menu.image),
  },
  quality: item.quality,
  duration: item.duration,
  promo: item.promo,
  price: item.price,
  total_price: item.totalPrice,
  note: item.note,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
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
    grouped.items.push(itemOutput(item));
    categoryItems.set(category.id, grouped);
  }

  const output: Record<string, unknown> = {
    _id: order.id,
    id_customer: order.customer
      ? { _id: order.customer.id, username: order.customer.username }
      : order.customerId,
    id_table: order.table
      ? { _id: order.table.id, name: order.table.name }
      : order.tableId,
    quality: order.quality,
    duration: order.duration,
    promo: order.promo,
    price: order.price,
    total_price: order.totalPrice,
    note: order.note,
    status: order.status.toLowerCase(),
    estimatedReadyAt: order.estimatedReadyAt,
    expires: order.expires,
    isExpired:
      Date.now() >= new Date(order.expires).getTime() ||
      order.status === "CASH" ||
      order.status === "VIRTUAL",
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };

  if (includeCategories) {
    output.categories = [...categoryItems.values()].map(
      ({ category, items }) => ({
        _id: category.id,
        name: category.name,
        desc: category.desc,
        image: imageUrl(category.image),
        itemOrders: items,
      }),
    );
  }
  if (order.items) output.itemOrder = items.map(itemOutput);
  return output;
};

exports.serializeOrder = orderOutput;

const menuSelection = Joi.object({
  id_menu: Joi.string().required(),
  quality: Joi.string().required(),
  note: Joi.string(),
});

const orderSchema = Joi.object({
  id_customer: Joi.string().required(),
  id_table: Joi.string().required(),
  note: Joi.string(),
  Menus: Joi.array().items(menuSelection).required(),
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
  customerId: body.id_customer,
  tableId: body.id_table,
  note: body.note,
  menus: body.Menus.map((menu: any) => ({
    id: menu.id_menu,
    quality: menu.quality,
    note: menu.note,
  })),
  expiresAt: new Date(Date.now() + Number(process.env.ORDERS_TIMEOUT)),
});

exports.ReadAll = async (
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
    return Response.Success(
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

exports.ReadOne = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const order = await findOrderById(requirePrisma(), req.params._id);
    if (
      !order ||
      (!req.auth?.roles?.some((role) => ["cashier", "owner"].includes(role)) &&
        order.customerId !== req.auth?.userId)
    ) {
      return next(error("load order failed", 404));
    }
    return Response.Success(res, "ReadOne", 0, 200, orderOutput(order, true));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Create = async (
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
      body.id_customer = req.auth.userId;
    }
    const order = await createOrder(requirePrisma(), toWrite(body));
    if (!order) return next(error("Create failed"));
    emitOrdersUpdate(req);
    return Response.Success(res, "Create", 0, 200, orderOutput(order, false));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Update = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    orderSchema.keys({
      Menus: Joi.array()
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
      req.params._id,
      toWrite(body),
    );
    if (!order) return next(error("Orders not found", 404));
    emitOrdersUpdate(req);
    return Response.Success(res, "Update", 0, 200, orderOutput(order, true));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.UpdateStatus = async (
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
      req.params._id,
      status,
    );
    if (!order) return next(error("order not found", 404));
    emitOrdersUpdate(req);
    return Response.Success(
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

exports.Delete = async (
  req: OrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const order = await deleteOrder(requirePrisma(), req.params._id);
    emitOrdersUpdate(req);
    return Response.Success(res, "Delete", 0, 200, orderOutput(order, false));
  } catch (cause) {
    return sendError(cause, next);
  }
};
