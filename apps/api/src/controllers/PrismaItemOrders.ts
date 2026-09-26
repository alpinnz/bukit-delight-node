import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import type { ItemOrderRecord } from "@bukit-delight/shared";

const Joi = require("joi");
const { Response } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const {
  createOrderItem,
  deleteOrderItem,
  findOrderItemById,
  listOrderItems,
  updateOrderItem,
} = require("./../services/PrismaOrders");

type ItemOrderRequest = Request & {
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
  if (code === "P2025") return next(error("ItemOrder not found", 404));
  logger.error({ err: cause }, "Prisma item order operation failed");
  return next(error("Item order request failed"));
};

const emitItemsUpdate = (req: ItemOrderRequest) =>
  req.app.io.emit("ItemOrdersUpdate", "ItemOrdersUpdate");

const imageUrl = (image?: string | null) =>
  image != null
    ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${image}`
    : null;

const itemOutput = (item: any, includeRelations = true): ItemOrderRecord => {
  const output: Record<string, unknown> = {
    _id: item.id,
    id_order: item.orderId,
    id_menu: item.menuId,
    quality: item.quality,
    duration: item.duration,
    promo: item.promo,
    price: item.price,
    total_price: item.totalPrice,
    note: item.note,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
  if (includeRelations && item.order) {
    output.id_order = {
      _id: item.order.id,
      id_customer: item.order.customerId,
      id_table: item.order.tableId,
      note: item.order.note,
      status: item.order.status.toLowerCase(),
    };
  }
  if (includeRelations && item.menu) {
    output.id_menu = {
      _id: item.menu.id,
      name: item.menu.name,
      desc: item.menu.desc,
      image: imageUrl(item.menu.image),
      price: item.menu.price,
      id_category: item.menu.categoryId,
    };
  }
  return output;
};

const schema = Joi.object({
  id_order: Joi.string().required(),
  id_menu: Joi.string().required(),
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
    orderId: value.id_order,
    menuId: value.id_menu,
    quality: value.quality,
    note: value.note,
  };
};

exports.ReadAll = async (
  _req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const items = await listOrderItems(requirePrisma());
    return Response.Success(
      res,
      "ReadAll",
      0,
      200,
      items.map((item: any) => itemOutput(item)),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.ReadOne = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const item = await findOrderItemById(requirePrisma(), req.params._id);
    if (!item) return next(error("ItemOrder not found", 404));
    return Response.Success(res, "ReadOne", 0, 200, itemOutput(item));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Create = async (
  req: ItemOrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const input = validate(req, next);
  if (!input) return;
  try {
    const item = await createOrderItem(requirePrisma(), input);
    emitItemsUpdate(req);
    return Response.Success(res, "Create", 0, 200, itemOutput(item));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Update = async (
  req: ItemOrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const input = validate(req, next);
  if (!input) return;
  try {
    const item = await updateOrderItem(requirePrisma(), req.params._id, input);
    if (!item) return next(error("itemOrder not found", 404));
    emitItemsUpdate(req);
    return Response.Success(res, "Update", 0, 200, itemOutput(item));
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Delete = async (
  req: ItemOrderRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const item = await deleteOrderItem(requirePrisma(), req.params._id);
    emitItemsUpdate(req);
    return Response.Success(res, "Delete", 0, 200, itemOutput(item, false));
  } catch (cause) {
    return sendError(cause, next);
  }
};
