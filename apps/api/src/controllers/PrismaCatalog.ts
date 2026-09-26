import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import type {
  CreateCategoryRequest,
  CreateMenuRequest,
  CreateTableRequest,
  CategoryRecord,
  MenuRecord,
  UpdateCategoryRequest,
  UpdateMenuRequest,
  UpdateTableRequest,
  TableRecord,
} from "@bukit-delight/shared";

const { randomBytes } = require("node:crypto");
const Joi = require("joi");
const { Response } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const {
  createCategory,
  createMenu,
  createTable,
  deleteCategory,
  deleteMenu,
  deleteTable,
  findCategoryById,
  findMenuById,
  findTableById,
  listCategories,
  listMenus,
  listTables,
  updateCategory,
  updateMenu,
  updateMenuAvailability,
  updateTable,
} = require("./../services/PrismaCatalog");

type CatalogRequest = Request & {
  file?: { fieldname?: string; filename: string };
  app: Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
};

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

const requirePrisma = () => {
  if (!prisma) throw error("PostgreSQL catalog storage is not configured");
  return prisma;
};

const sendError = (cause: unknown, next: NextFunction) => {
  const status = (cause as { status?: number })?.status;
  if (status && status < 500) {
    return next(error(String((cause as Error).message), status));
  }

  const code = (cause as { code?: string })?.code;
  if (code === "P2025") return next(error("Record not found", 404));
  if (code === "P2003") return next(error("Record is still referenced", 409));
  if (code === "P2002") return next(error("Name is already", 409));
  logger.error({ err: cause }, "Prisma catalog operation failed");
  return next(error("Catalog request failed"));
};

const emitUpdate = (req: CatalogRequest, event: string) =>
  req.app.io.emit(event, event);

const createId = () => randomBytes(12).toString("hex");
const imageUrl = (image?: string | null) =>
  image != null
    ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${image}`
    : null;

const validate = (schema: unknown, req: Request, next: NextFunction) => {
  const { error: validationError, value } = (schema as any).validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return value;
};

const requireImage = (req: CatalogRequest, next: NextFunction) => {
  if (!req.file || req.file.fieldname !== "image") {
    next(error("required image", 400));
    return false;
  }
  return true;
};

const serializeCategory = (
  { id, image, ...category }: any,
  formatImage = true,
): CategoryRecord => ({
  _id: id,
  ...category,
  image: formatImage ? imageUrl(image) : image,
});

const serializeMenu = (
  { id, category, categoryId, image, ...menu }: any,
  formatImage = true,
): MenuRecord => ({
  _id: id,
  ...menu,
  id_category: category
    ? (({ id: categoryIdentifier, ...categoryFields }: any) => ({
        _id: categoryIdentifier,
        ...categoryFields,
      }))(category)
    : categoryId,
  image: formatImage ? imageUrl(image) : image,
});

const serializeTable = ({ id, ...table }: any): TableRecord => ({
  _id: id,
  ...table,
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
  desc: Joi.string().required(),
});

exports.Categories = {
  ReadAll: async (_req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      const categories = await listCategories(requirePrisma());
      return Response.Success(
        res,
        "Categories",
        0,
        200,
        categories.map((category: any) => serializeCategory(category)),
      );
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  ReadOne: async (req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      const category = await findCategoryById(requirePrisma(), req.params._id);
      if (!category) return next(error("Category not found", 404));
      return Response.Success(
        res,
        "Category",
        0,
        200,
        serializeCategory(category),
      );
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Create: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(
      categorySchema,
      req,
      next,
    ) as CreateCategoryRequest | null;
    if (!body || !requireImage(req, next)) return;
    try {
      const category = await createCategory(requirePrisma(), {
        id: createId(),
        name: body.name,
        desc: body.desc,
        image: req.file!.filename,
      });
      emitUpdate(req, "CategoriesUpdate");
      return Response.Success(res, "Create", 0, 200, {
        name: category.name,
        desc: category.desc,
        image: category.image,
      });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Update: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(
      categorySchema,
      req,
      next,
    ) as UpdateCategoryRequest | null;
    if (!body) return;
    try {
      const database = requirePrisma();
      const current = await findCategoryById(database, req.params._id);
      if (!current) return next(error("Category not found", 404));
      const category = await updateCategory(database, current.id, {
        name: body.name,
        desc: body.desc,
        image:
          req.file?.fieldname === "image" ? req.file.filename : current.image,
      });
      emitUpdate(req, "CategoriesUpdate");
      return Response.Success(res, "Update", 0, 200, {
        name: category.name,
        desc: category.desc,
        image: category.image,
      });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Delete: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    try {
      const category = await deleteCategory(requirePrisma(), req.params._id);
      emitUpdate(req, "CategoriesUpdate");
      return Response.Success(
        res,
        "Delete",
        0,
        200,
        serializeCategory(category, false),
      );
    } catch (cause) {
      return sendError(cause, next);
    }
  },
};

const menuSchema = Joi.object({
  name: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().required(),
  promo: Joi.number(),
  duration: Joi.number().required(),
  id_category: Joi.string().required(),
  isAvailable: Joi.boolean().required(),
  isFavorite: Joi.boolean().required(),
});

const menuWrite = (body: any, image: string, id?: string) => ({
  ...(id ? { id } : {}),
  name: body.name,
  desc: body.desc,
  image,
  categoryId: body.id_category,
  price: body.price,
  promo: body.promo || 0,
  duration: body.duration,
  isAvailable: body.isAvailable,
  isFavorite: body.isFavorite,
});

exports.Menus = {
  ReadAll: async (_req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      const menus = await listMenus(requirePrisma());
      return Response.Success(
        res,
        "ReadAll",
        0,
        200,
        menus.map((menu: any) => serializeMenu(menu)),
      );
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  ReadOne: async (req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      const menu = await findMenuById(requirePrisma(), req.params._id);
      if (!menu) return next(error("Menu not found", 404));
      return Response.Success(res, "ReadOne", 0, 200, serializeMenu(menu));
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Create: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(menuSchema, req, next) as CreateMenuRequest | null;
    if (!body || !requireImage(req, next)) return;
    try {
      const menu = await createMenu(
        requirePrisma(),
        menuWrite(body, req.file!.filename, createId()),
      );
      emitUpdate(req, "MenusUpdate");
      return Response.Success(res, "Create", 0, 200, {
        name: menu.name,
        desc: menu.desc,
        image: menu.image,
        price: menu.price,
        promo: menu.promo,
        duration: menu.duration,
        category: menu.category.name,
        isAvailable: menu.isAvailable,
        isFavorite: menu.isFavorite,
      });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Update: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(
      menuSchema.keys({ promo: Joi.number().required() }),
      req,
      next,
    ) as UpdateMenuRequest | null;
    if (!body) return;
    try {
      const database = requirePrisma();
      const current = await findMenuById(database, req.params._id);
      if (!current) return next(error("Menu not found", 404));
      const menu = await updateMenu(
        database,
        current.id,
        menuWrite(
          body,
          req.file?.fieldname === "image" ? req.file.filename : current.image,
        ),
      );
      emitUpdate(req, "MenusUpdate");
      return Response.Success(res, "Update", 0, 200, {
        name: menu.name,
        desc: menu.desc,
        image: menu.image,
        price: menu.price,
        promo: menu.promo,
        duration: menu.duration,
        category: menu.category.name,
        isAvailable: menu.isAvailable,
        isFavorite: menu.isFavorite,
      });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  UpdateisAvailable: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(
      Joi.object({ isAvailable: Joi.boolean().required() }),
      req,
      next,
    );
    if (!body) return;
    try {
      const menu = await updateMenuAvailability(
        requirePrisma(),
        req.params._id,
        body.isAvailable,
      );
      emitUpdate(req, "MenusUpdate");
      return Response.Success(res, "Update", 0, 200, {
        name: menu.name,
        desc: menu.desc,
        image: menu.image,
        price: menu.price,
        promo: menu.promo,
        duration: menu.duration,
        category: menu.category.name,
        isAvailable: menu.isAvailable,
        isFavorite: menu.isFavorite,
      });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Delete: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    try {
      const menu = await deleteMenu(requirePrisma(), req.params._id);
      emitUpdate(req, "MenusUpdate");
      return Response.Success(
        res,
        "Delete",
        0,
        200,
        serializeMenu(menu, false),
      );
    } catch (cause) {
      return sendError(cause, next);
    }
  },
};

const tableSchema = Joi.object({ name: Joi.string().required() });

exports.Tables = {
  ReadAll: async (_req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      const tables = await listTables(requirePrisma());
      return Response.Success(
        res,
        "ReadAll",
        0,
        200,
        tables.map((table: any) => serializeTable(table)),
      );
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  ReadOne: async (req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      const table = await findTableById(requirePrisma(), req.params._id);
      if (!table) return next(error("Table not found", 404));
      return Response.Success(res, "ReadOne", 0, 200, serializeTable(table));
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Create: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(tableSchema, req, next) as CreateTableRequest | null;
    if (!body) return;
    try {
      const table = await createTable(requirePrisma(), createId(), body.name);
      emitUpdate(req, "TablesUpdate");
      return Response.Success(res, "Create", 0, 200, { name: table.name });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Update: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const body = validate(tableSchema, req, next) as UpdateTableRequest | null;
    if (!body) return;
    try {
      const table = await updateTable(
        requirePrisma(),
        req.params._id,
        body.name,
      );
      emitUpdate(req, "TablesUpdate");
      return Response.Success(res, "Update", 0, 200, { name: table.name });
    } catch (cause) {
      return sendError(cause, next);
    }
  },
  Delete: async (
    req: CatalogRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    try {
      const table = await deleteTable(requirePrisma(), req.params._id);
      emitUpdate(req, "TablesUpdate");
      return Response.Success(res, "Delete", 0, 200, serializeTable(table));
    } catch (cause) {
      return sendError(cause, next);
    }
  },
};
