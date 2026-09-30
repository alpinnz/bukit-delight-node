import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import type { OrderItemRecord } from "@bukit-delight/shared";

const Joi = require("joi");
const { response } = require("../middlewares");
const { prisma } = require("../config/prisma");
const logger = require("../utils/logger");
const {
  createOrderItem,
  deleteOrderItem,
  findOrderItemById,
  listOrderItems,
  updateOrderItem,
} = require("../services/orders.service");

type OrderItemRequest = Request & {
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
  if (code === "P2025") return next(error("Order item not found", 404));
  logger.error({ err: cause }, "Prisma item order operation failed");
  return next(error("Item order request failed"));
};

const emitOrderItemsUpdate = (req: OrderItemRequest) =>
  req.app.io.emit("ItemOrdersUpdate", "ItemOrdersUpdate");

const imageUrl = (image?: string | null) =>
  image != null
    ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${image}`
    : null;

const orderItemOutput = (
  item: any,
  includeRelations = true,
): OrderItemRecord => {
  const output: Record<string, unknown> = {
    id: item.id,
    order_id: item.order_id,
    menu_id: item.menu_id,
    quality: item.quality,
    duration: item.duration,
    promo: item.promo,
    price: item.price,
    total_price: item.total_price,
    note: item.note,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
  if (includeRelations && item.order) {
    output.order_id = {
      id: item.order.id,
      customer_id: item.order.customer_id,
      table_id: item.order.table_id,
      note: item.order.note,
      status: item.order.status.toLowerCase(),
    };
  }
  if (includeRelations && item.menu) {
    output.menu_id = {
      id: item.menu.id,
      name: item.menu.name,
      desc: item.menu.desc,
      image: imageUrl(item.menu.image),
      price: item.menu.price,
      category_id: item.menu.category_id,
    };
  }
  return output;
};

const schema = Joi.object({
  order_id: Joi.string().required(),
  menu_id: Joi.string().required(),
  quality: Joi.number().positive().required(),
  note: Joi.string().required(),
});

const validate = (req: Request, next: NextFunction) => {
  const { error: validationError, value } = schema.validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return {
    order_id: value.order_id,
    menu_id: value.menu_id,
    quality: value.quality,
    note: value.note,
  };
};

exports.readAll = async (
  _req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const items = await listOrderItems(requirePrisma());
    return response.success(
      res,
      "ReadAll",
      0,
      200,
      items.map((item: any) => orderItemOutput(item)),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.readOne = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const item = await findOrderItemById(requirePrisma(), req.params.id);
    if (!item) return next(error("Order item not found", 404));
    return response.success(res, "ReadOne", 0, 200, orderItemOutput(item));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.create = async (
  req: OrderItemRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const input = validate(req, next);
  if (!input) return;
  try {
    const item = await createOrderItem(requirePrisma(), input);
    emitOrderItemsUpdate(req);
    return response.success(res, "Create", 0, 200, orderItemOutput(item));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.update = async (
  req: OrderItemRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const input = validate(req, next);
  if (!input) return;
  try {
    const item = await updateOrderItem(requirePrisma(), req.params.id, input);
    if (!item) return next(error("Order item not found", 404));
    emitOrderItemsUpdate(req);
    return response.success(res, "Update", 0, 200, orderItemOutput(item));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.delete = async (
  req: OrderItemRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const item = await deleteOrderItem(requirePrisma(), req.params.id);
    emitOrderItemsUpdate(req);
    return response.success(res, "Delete", 0, 200, orderItemOutput(item, false));
  } catch (cause) {
    return sendError(cause, next);
  }
};
