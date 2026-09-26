import type { PrismaClient } from "../generated/prisma/client";
import type { OrderPaymentStatus } from "@bukit-delight/shared";
import { lockOrdersForMutation } from "./PrismaOrderLocks";

type OrderDatabase = Pick<
  PrismaClient,
  "customer" | "diningTable" | "menu" | "order" | "orderItem" | "transaction"
> &
  Pick<PrismaClient, "$queryRaw">;
type OrderTransaction = OrderDatabase;

type MenuSelection = {
  id: string;
  quality: string | number;
  note?: string;
};

type OrderWrite = {
  customerId: string;
  tableId: string;
  note?: string;
  menus: MenuSelection[];
  expiresAt: Date;
};

const orderRelations = {
  customer: { select: { id: true, username: true } },
  table: { select: { id: true, name: true } },
  items: {
    include: {
      menu: {
        include: {
          category: {
            select: { id: true, name: true, desc: true, image: true },
          },
        },
      },
    },
  },
} as const;

const fail = (message: string, status: number) =>
  Object.assign(new Error(message), { status });

const newId = () => require("node:crypto").randomBytes(12).toString("hex");

const calculateItems = (
  menus: MenuSelection[],
  availableMenus: Array<{
    id: string;
    price: number;
    promo: number;
    duration: number;
  }>,
  orderId: string,
) => {
  const menuById = new Map(availableMenus.map((menu) => [menu.id, menu]));
  const missing = [
    ...new Set(
      menus.filter((item) => !menuById.has(item.id)).map((item) => item.id),
    ),
  ];
  if (missing.length) {
    throw fail(`Menu item not match : ${missing.join(",")}`, 404);
  }

  return menus.map((selection) => {
    const menu = menuById.get(selection.id)!;
    const quality = Number(selection.quality);
    if (!Number.isFinite(quality) || quality <= 0) {
      throw fail("Menu quantity must be a positive number", 400);
    }
    const price = menu.price * quality;
    const promo = menu.promo * quality;
    return {
      id: newId(),
      orderId,
      menuId: menu.id,
      quality,
      duration: menu.duration * quality,
      promo,
      price,
      totalPrice: price - promo,
      note: selection.note || "",
    };
  });
};

const totalItems = (items: ReturnType<typeof calculateItems>) =>
  items.reduce(
    (totals, item) => ({
      quality: totals.quality + item.quality,
      duration: totals.duration + item.duration,
      promo: totals.promo + item.promo,
      price: totals.price + item.price,
      totalPrice: totals.totalPrice + item.totalPrice,
    }),
    { quality: 0, duration: 0, promo: 0, price: 0, totalPrice: 0 },
  );

type OrderItemWrite = {
  orderId: string;
  menuId: string;
  quality: number;
  note?: string;
};

const orderItemRelations = {
  order: {
    select: {
      id: true,
      customerId: true,
      tableId: true,
      note: true,
      status: true,
    },
  },
  menu: {
    include: {
      category: { select: { id: true, name: true, desc: true, image: true } },
    },
  },
} as const;

const findOrderItemInputs = async (
  transaction: OrderTransaction,
  input: OrderItemWrite,
) => {
  const order = await transaction.order.findUnique({
    where: { id: input.orderId },
    select: { id: true },
  });
  if (!order) throw fail("order not found", 404);

  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId: order.id },
    select: { id: true },
  });
  if (existingTransaction) throw fail("Order in transactions", 409);

  const menu = await transaction.menu.findUnique({
    where: { id: input.menuId },
    select: { id: true, price: true, promo: true, duration: true },
  });
  if (!menu) throw fail("menu not found", 404);

  const quality = Number(input.quality);
  if (!Number.isFinite(quality) || quality <= 0) {
    throw fail("Menu quantity must be a positive number", 400);
  }

  return {
    order,
    item: {
      orderId: order.id,
      menuId: menu.id,
      quality,
      duration: menu.duration * quality,
      promo: menu.promo * quality,
      price: menu.price * quality,
      totalPrice: (menu.price - menu.promo) * quality,
      note: input.note || "",
    },
  };
};

const recalculateOrderTotals = async (
  transaction: OrderTransaction,
  orderId: string,
) => {
  const items = await transaction.orderItem.findMany({
    where: { orderId },
    select: {
      quality: true,
      duration: true,
      promo: true,
      price: true,
      totalPrice: true,
    },
  });
  const totals = items.reduce(
    (sum, item) => ({
      quality: sum.quality + item.quality,
      duration: sum.duration + item.duration,
      promo: sum.promo + item.promo,
      price: sum.price + item.price,
      totalPrice: sum.totalPrice + item.totalPrice,
    }),
    { quality: 0, duration: 0, promo: 0, price: 0, totalPrice: 0 },
  );
  await transaction.order.update({ where: { id: orderId }, data: totals });
};

export const listOrderItems = (database: OrderDatabase) =>
  database.orderItem.findMany({ include: orderItemRelations });

export const findOrderItemById = (database: OrderDatabase, id: string) =>
  database.orderItem.findUnique({
    where: { id },
    include: orderItemRelations,
  });

export const createOrderItemInTransaction = async (
  transaction: OrderTransaction,
  input: OrderItemWrite,
) => {
  await lockOrdersForMutation(transaction, [input.orderId]);
  const { order, item } = await findOrderItemInputs(transaction, input);
  const created = await transaction.orderItem.create({
    data: { id: newId(), ...item },
  });
  await recalculateOrderTotals(transaction, order.id);
  return created;
};

export const createOrderItem = async (
  database: PrismaClient,
  input: OrderItemWrite,
) => {
  const created = await database.$transaction((transaction) =>
    createOrderItemInTransaction(transaction, input),
  );
  return findOrderItemById(database, created.id);
};

export const updateOrderItemInTransaction = async (
  transaction: OrderTransaction,
  id: string,
  input: OrderItemWrite,
) => {
  const initial = await transaction.orderItem.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!initial) throw fail("itemOrder not found", 404);

  await lockOrdersForMutation(transaction, [initial.orderId, input.orderId]);
  const current = await transaction.orderItem.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!current) throw fail("itemOrder not found", 404);
  if (current.orderId !== initial.orderId) {
    throw fail("Item order changed concurrently; retry the request", 409);
  }
  const sourceTransaction = await transaction.transaction.findUnique({
    where: { orderId: current.orderId },
    select: { id: true },
  });
  if (sourceTransaction) throw fail("Order in transactions", 409);

  const { order, item } = await findOrderItemInputs(transaction, input);
  const updated = await transaction.orderItem.update({
    where: { id },
    data: item,
  });
  await recalculateOrderTotals(transaction, current.orderId);
  if (current.orderId !== order.id) {
    await recalculateOrderTotals(transaction, order.id);
  }
  return updated;
};

export const updateOrderItem = async (
  database: PrismaClient,
  id: string,
  input: OrderItemWrite,
) => {
  await database.$transaction((transaction) =>
    updateOrderItemInTransaction(transaction, id, input),
  );
  return findOrderItemById(database, id);
};

export const deleteOrderItemInTransaction = async (
  transaction: OrderTransaction,
  id: string,
) => {
  const initial = await transaction.orderItem.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!initial) throw fail("ItemOrder not found", 404);

  await lockOrdersForMutation(transaction, [initial.orderId]);
  const current = await transaction.orderItem.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!current) throw fail("ItemOrder not found", 404);
  if (current.orderId !== initial.orderId) {
    throw fail("Item order changed concurrently; retry the request", 409);
  }
  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId: current.orderId },
    select: { id: true },
  });
  if (existingTransaction) throw fail("Order in transactions", 409);

  const deleted = await transaction.orderItem.delete({ where: { id } });
  await recalculateOrderTotals(transaction, current.orderId);
  return deleted;
};

export const deleteOrderItem = (database: PrismaClient, id: string) =>
  database.$transaction((transaction) =>
    deleteOrderItemInTransaction(transaction, id),
  );

const findOrderInputs = async (database: OrderDatabase, input: OrderWrite) => {
  const customer = await database.customer.findUnique({
    where: { id: input.customerId },
    select: { id: true },
  });
  if (!customer) throw fail("customer not found", 404);

  const table = await database.diningTable.findUnique({
    where: { id: input.tableId },
    select: { id: true },
  });
  if (!table) throw fail("table not found", 404);

  const menus = await database.menu.findMany({
    where: { id: { in: [...new Set(input.menus.map((item) => item.id))] } },
    select: { id: true, price: true, promo: true, duration: true },
  });
  return { menus };
};

export const listOrders = (database: OrderDatabase, customerId?: string) =>
  database.order.findMany({
    where: customerId ? { customerId } : undefined,
    include: orderRelations,
    orderBy: { createdAt: "desc" },
  });

export const findOrderById = (database: OrderDatabase, orderId: string) =>
  database.order.findUnique({
    where: { id: orderId },
    include: orderRelations,
  });

export const createOrderInTransaction = async (
  transaction: OrderTransaction,
  input: OrderWrite,
) => {
  if (input.menus.length === 0) throw fail("Menu item not found", 400);
  const { menus } = await findOrderInputs(transaction, input);
  const orderId = newId();
  const items = calculateItems(input.menus, menus, orderId);
  const totals = totalItems(items);

  const order = await transaction.order.create({
    data: {
      id: orderId,
      customerId: input.customerId,
      tableId: input.tableId,
      ...totals,
      note: input.note || "",
      status: "PENDING",
      estimasi: input.expiresAt,
      expires: input.expiresAt,
    },
  });
  await transaction.orderItem.createMany({ data: items });
  return order;
};

export const createOrder = async (
  database: PrismaClient,
  input: OrderWrite,
) => {
  const order = await database.$transaction((transaction) =>
    createOrderInTransaction(transaction, input),
  );
  return findOrderById(database, order.id);
};

export const updateOrderInTransaction = async (
  transaction: OrderTransaction,
  orderId: string,
  input: OrderWrite,
) => {
  await lockOrdersForMutation(transaction, [orderId]);
  const existingOrder = await transaction.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });
  if (!existingOrder) throw fail("Orders not found", 404);
  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId },
    select: { id: true },
  });
  if (existingTransaction) throw fail("Order in transactions", 409);
  if (input.menus.length === 0) throw fail("Menu item not found", 400);

  const { menus } = await findOrderInputs(transaction, input);
  const items = calculateItems(input.menus, menus, orderId);
  const totals = totalItems(items);
  await transaction.orderItem.deleteMany({ where: { orderId } });
  const updatedOrder = await transaction.order.update({
    where: { id: orderId },
    data: {
      customerId: input.customerId,
      tableId: input.tableId,
      ...totals,
      note: input.note || "",
      status: "PENDING",
    },
  });
  await transaction.orderItem.createMany({ data: items });
  return updatedOrder;
};

export const updateOrder = async (
  database: PrismaClient,
  orderId: string,
  input: OrderWrite,
) => {
  await database.$transaction((transaction) =>
    updateOrderInTransaction(transaction, orderId, input),
  );
  return findOrderById(database, orderId);
};

export const updateOrderStatusInTransaction = async (
  transaction: OrderTransaction,
  orderId: string,
  status: Uppercase<OrderPaymentStatus>,
) => {
  await lockOrdersForMutation(transaction, [orderId]);
  const order = await transaction.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });
  if (!order) throw fail("order not found", 404);
  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId },
    select: { id: true },
  });
  if (existingTransaction) throw fail("Order in transactions", 409);
  return transaction.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const updateOrderStatus = async (
  database: PrismaClient,
  orderId: string,
  status: Uppercase<OrderPaymentStatus>,
) => {
  await database.$transaction((transaction) =>
    updateOrderStatusInTransaction(transaction, orderId, status),
  );
  return findOrderById(database, orderId);
};

export const deleteOrderInTransaction = async (
  transaction: OrderTransaction,
  orderId: string,
) => {
  await lockOrdersForMutation(transaction, [orderId]);
  const order = await transaction.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw fail("Orders not found", 404);
  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId },
    select: { id: true },
  });
  if (existingTransaction) throw fail("Order in transactions", 409);
  await transaction.orderItem.deleteMany({ where: { orderId } });
  await transaction.order.delete({ where: { id: orderId } });
  return order;
};

export const deleteOrder = (database: PrismaClient, orderId: string) =>
  database.$transaction((transaction) =>
    deleteOrderInTransaction(transaction, orderId),
  );
