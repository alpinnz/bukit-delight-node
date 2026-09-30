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

export const listFavoriteMenuTransactions = async (
  database: FavoriteDatabase,
) => {
  const transactions = await database.transaction.findMany({
    select: { order_id: true },
  });
  if (!transactions) {
    throw Object.assign(new Error("Transactions not found"), { status: 404 });
  }
  const orderIds = [...new Set(transactions.map(({ order_id }) => order_id))];
  if (orderIds.length === 0) return [];

  const [menus, itemOrders] = await Promise.all([
    database.menu.findMany({ orderBy: { created_at: "asc" } }),
    database.orderItem.findMany({
      where: { order_id: { in: orderIds } },
      select: { menu_id: true, quality: true },
    }),
  ]);
  const countByMenu = new Map<string, number>();

  for (const item of itemOrders) {
    if (item.quality <= 0) continue;
    const count = Math.ceil(item.quality);
    countByMenu.set(item.menu_id, (countByMenu.get(item.menu_id) ?? 0) + count);
  }

  let no = 0;
  return menus.flatMap((menu) => {
    const totalTransactions = countByMenu.get(menu.id) ?? 0;
    if (totalTransactions === 0) return [];
    no += 1;
    return [
      {
        id: menu.id,
        no,
        name: menu.name,
        desc: menu.desc,
        image: imageUrl(menu.image),
        price: menu.price,
        category_id: menu.category_id,
        created_at: menu.created_at,
        updated_at: menu.updated_at,
        promo: menu.promo,
        is_available: menu.is_available,
        is_favorite: menu.is_favorite,
        total_transactions: totalTransactions,
      },
    ];
  });
};
