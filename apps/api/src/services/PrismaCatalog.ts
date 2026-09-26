import type { PrismaClient } from "../generated/prisma/client";

type CatalogDatabase = Pick<
  PrismaClient,
  "category" | "menu" | "diningTable" | "orderItem" | "order"
>;
type CatalogTransaction = CatalogDatabase & Pick<PrismaClient, "$queryRaw">;

type CategoryWrite = {
  id: string;
  name: string;
  desc: string;
  image?: string | null;
};

type MenuWrite = {
  id: string;
  name: string;
  desc?: string | null;
  image: string;
  categoryId: string;
  price: number;
  promo: number;
  duration: number;
  isAvailable: boolean;
  isFavorite: boolean;
};

const menuCategory = {
  id: true,
  name: true,
  desc: true,
  image: true,
} as const;

const fail = (message: string, status: number) =>
  Object.assign(new Error(message), { status });

const lockName = async (
  transaction: CatalogTransaction,
  entity: string,
  name: string,
) => {
  const lockKey = `${entity}:${name.toLowerCase()}`;
  await transaction.$queryRaw`
    SELECT 'locked'::text
    FROM pg_advisory_xact_lock(hashtext(${lockKey})::bigint)
  `;
};

const assertCategoryNameAvailable = async (
  database: CatalogDatabase,
  name: string,
  exceptId?: string,
) => {
  const found = await database.category.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { id: true },
  });
  if (found) throw fail("Name is already", 409);
};

const assertMenuNameAvailable = async (
  database: CatalogDatabase,
  name: string,
  exceptId?: string,
) => {
  const found = await database.menu.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { id: true },
  });
  if (found) throw fail("Name is already", 409);
};

const assertTableNameAvailable = async (
  database: CatalogDatabase,
  name: string,
  exceptId?: string,
) => {
  const found = await database.diningTable.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { id: true },
  });
  if (found) throw fail("Name is already", 409);
};

export const listCategories = (database: CatalogDatabase) =>
  database.category.findMany({ orderBy: { name: "asc" } });

export const findCategoryById = (database: CatalogDatabase, id: string) =>
  database.category.findUnique({ where: { id } });

export const createCategoryInTransaction = async (
  transaction: CatalogTransaction,
  category: CategoryWrite,
) => {
  const name = category.name.toUpperCase();
  await lockName(transaction, "category", name);
  await assertCategoryNameAvailable(transaction, name);
  return transaction.category.create({ data: { ...category, name } });
};

export const createCategory = (
  database: PrismaClient,
  category: CategoryWrite,
) =>
  database.$transaction((transaction) =>
    createCategoryInTransaction(transaction, category),
  );

export const updateCategoryInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
  category: Omit<CategoryWrite, "id">,
) => {
  const name = category.name.toUpperCase();
  await lockName(transaction, "category", name);
  await assertCategoryNameAvailable(transaction, name, id);
  return transaction.category.update({
    where: { id },
    data: { ...category, name },
  });
};

export const updateCategory = (
  database: PrismaClient,
  id: string,
  category: Omit<CategoryWrite, "id">,
) =>
  database.$transaction((transaction) =>
    updateCategoryInTransaction(transaction, id, category),
  );

export const deleteCategoryInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
) => {
  const menuCount = await transaction.menu.count({ where: { categoryId: id } });
  if (menuCount) throw fail("Category is still referenced by menus", 409);
  return transaction.category.delete({ where: { id } });
};

export const deleteCategory = (database: PrismaClient, id: string) =>
  database.$transaction((transaction) =>
    deleteCategoryInTransaction(transaction, id),
  );

export const listMenus = (database: CatalogDatabase) =>
  database.menu.findMany({
    include: { category: { select: menuCategory } },
    orderBy: { name: "asc" },
  });

export const findMenuById = (database: CatalogDatabase, id: string) =>
  database.menu.findUnique({
    where: { id },
    include: { category: { select: menuCategory } },
  });

const assertCategoryExists = async (database: CatalogDatabase, id: string) => {
  const category = await database.category.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!category) throw fail("Category not found", 404);
};

export const createMenuInTransaction = async (
  transaction: CatalogTransaction,
  menu: MenuWrite,
) => {
  await lockName(transaction, "menu", menu.name);
  await assertMenuNameAvailable(transaction, menu.name);
  await assertCategoryExists(transaction, menu.categoryId);
  return transaction.menu.create({
    data: menu,
    include: { category: { select: menuCategory } },
  });
};

export const createMenu = (database: PrismaClient, menu: MenuWrite) =>
  database.$transaction((transaction) =>
    createMenuInTransaction(transaction, menu),
  );

export const updateMenuInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
  menu: Omit<MenuWrite, "id">,
) => {
  await lockName(transaction, "menu", menu.name);
  await assertMenuNameAvailable(transaction, menu.name, id);
  await assertCategoryExists(transaction, menu.categoryId);
  return transaction.menu.update({
    where: { id },
    data: menu,
    include: { category: { select: menuCategory } },
  });
};

export const updateMenu = (
  database: PrismaClient,
  id: string,
  menu: Omit<MenuWrite, "id">,
) =>
  database.$transaction((transaction) =>
    updateMenuInTransaction(transaction, id, menu),
  );

export const updateMenuAvailability = (
  database: PrismaClient,
  id: string,
  isAvailable: boolean,
) =>
  database.menu.update({
    where: { id },
    data: { isAvailable },
    include: { category: { select: menuCategory } },
  });

export const deleteMenuInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
) => {
  const orderItemCount = await transaction.orderItem.count({
    where: { menuId: id },
  });
  if (orderItemCount) throw fail("Menu is still referenced by orders", 409);
  return transaction.menu.delete({ where: { id } });
};

export const deleteMenu = (database: PrismaClient, id: string) =>
  database.$transaction((transaction) =>
    deleteMenuInTransaction(transaction, id),
  );

export const listTables = (database: CatalogDatabase) =>
  database.diningTable.findMany({ orderBy: { name: "asc" } });

export const findTableById = (database: CatalogDatabase, id: string) =>
  database.diningTable.findUnique({ where: { id } });

export const createTableInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
  rawName: string,
) => {
  const name = rawName.toLowerCase();
  await lockName(transaction, "table", name);
  await assertTableNameAvailable(transaction, name);
  return transaction.diningTable.create({ data: { id, name } });
};

export const createTable = (database: PrismaClient, id: string, name: string) =>
  database.$transaction((transaction) =>
    createTableInTransaction(transaction, id, name),
  );

export const updateTableInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
  rawName: string,
) => {
  const name = rawName.toLowerCase();
  await lockName(transaction, "table", name);
  await assertTableNameAvailable(transaction, name, id);
  return transaction.diningTable.update({ where: { id }, data: { name } });
};

export const updateTable = (database: PrismaClient, id: string, name: string) =>
  database.$transaction((transaction) =>
    updateTableInTransaction(transaction, id, name),
  );

export const deleteTableInTransaction = async (
  transaction: CatalogTransaction,
  id: string,
) => {
  const orderCount = await transaction.order.count({ where: { tableId: id } });
  if (orderCount) throw fail("Table is still referenced by orders", 409);
  return transaction.diningTable.delete({ where: { id } });
};

export const deleteTable = (database: PrismaClient, id: string) =>
  database.$transaction((transaction) =>
    deleteTableInTransaction(transaction, id),
  );
