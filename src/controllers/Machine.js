const { Response } = require("./../middlewares");
const {
  Accounts,
  Menus,
  Transactions,
  ItemOrders,
  Categories,
} = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.Favorite = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.find();
    if (!transactions) return resError(res, "Transactions not found", 400);

    const menus = await Menus.find();
    if (!menus) return next(err("load menus failed"));

    const data_menus = menus.map((e) => {
      if (!`${e["image"]}`.includes("http")) {
        e["image"] = e["image"]
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["image"]}`
          : null;
      }
      return e;
    });
    if (!data_menus) return next(err("load data_menus failed"));

    const itemOrders = await ItemOrders.find();
    if (!itemOrders) return next(err("load item orders failed"));

    let menus_tr = [];

    transactions.forEach((e) => {
      const id_order = itemOrders.filter(
        (x) => x["id_order"].toString() === e["id_order"].toString()
      );

      id_order.forEach((j) => {
        const id_menu = data_menus.find(
          (x) => x["_id"].toString() === j["id_menu"].toString()
        );
        menus_tr.push(id_menu);
      });
    });

    let menus_count_tr = [];

    data_menus.forEach((e) => {
      const menus_filter = menus_tr.filter(
        (x) => x["_id"].toString() === e["_id"].toString()
      );

      if (menus_filter.length > 0) {
        menus_count_tr.push({
          _id: e["id"],
          name: e["name"],
          desc: e["desc"],
          image: e["image"],
          price: e["price"],
          id_category: e["id_category"],
          createdAt: e["createdAt"],
          updatedAt: e["updatedAt"],
          __v: e["__v"],
          promo: e["promo"],
          isAvailable: e["isAvailable"],
          duration: e["duration"],
          total_transactions: menus_filter.length,
        });
      }
    });

    //

    let Cluster = ["c1", "c2", "c3"];

    return Response.Success(res, "Menu Favorite", 0, 200, menus_count_tr);
  } catch (error) {
    return next(err(error, 200));
  }
};
