import type { PrismaClient } from "../generated/prisma/client";

type FavoriteDatabase = Pick<
  PrismaClient,
  "transaction" | "orderItem" | "menu"
>;

const imageUrl = (image?: string | null) => {
  if (!image) return null;
  if (image.includes("http")) return image;
  return `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${image}`;
};

export const transactionByItemOrder = async (database: FavoriteDatabase) => {
  const transactions = await database.transaction.findMany({
    select: { orderId: true },
  });
  if (!transactions) {
    throw Object.assign(new Error("Transactions not found"), { status: 404 });
  }
  const orderIds = [...new Set(transactions.map(({ orderId }) => orderId))];
  if (orderIds.length === 0) return [];

  const [menus, itemOrders] = await Promise.all([
    database.menu.findMany({ orderBy: { createdAt: "asc" } }),
    database.orderItem.findMany({
      where: { orderId: { in: orderIds } },
      select: { menuId: true, quality: true },
    }),
  ]);
  const countByMenu = new Map<string, number>();

  for (const item of itemOrders) {
    if (item.quality <= 0) continue;
    const count = Math.ceil(item.quality);
    countByMenu.set(item.menuId, (countByMenu.get(item.menuId) ?? 0) + count);
  }

  let no = 0;
  return menus.flatMap((menu) => {
    const totalTransactions = countByMenu.get(menu.id) ?? 0;
    if (totalTransactions === 0) return [];
    no += 1;
    return [
      {
        _id: menu.id,
        no,
        name: menu.name,
        desc: menu.desc,
        image: imageUrl(menu.image),
        price: menu.price,
        id_category: menu.categoryId,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
        promo: menu.promo,
        isAvailable: menu.isAvailable,
        isFavorite: menu.isFavorite,
        total_transactions: totalTransactions,
      },
    ];
  });
};
