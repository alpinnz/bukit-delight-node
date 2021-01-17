const Joi = require("joi");
const { Response } = require("./../middlewares");
const {
  Accounts,
  Orders,
  Transactions,
  ItemOrders,
  Categories,
} = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.find();
    if (!transactions) return resError(res, "Transactions not found", 400);

    const accounts = await Accounts.find()
      .select(["_id", "username", "email", "id_role"])
      .populate({
        path: "id_role",
        select: "name",
      });

    if (!accounts) return next(err("load orders failed"));

    const orders = await Orders.find()
      .select([
        "_id",
        "id_customer",
        "id_table",
        "quality",
        "duration",
        "promo",
        "price",
        "total_price",
        "note",
        "status",
        "estimasi",
        "expires",
        "createdAt",
        "updatedAt",
      ])
      .populate({
        path: "id_table",
        select: "name",
      })
      .populate({
        path: "id_customer",
        select: "username",
      });

    if (!orders) return next(err("load orders failed"));

    const itemOrders = await ItemOrders.find()
      .select([
        "_id",
        "id_menu",
        "id_order",
        "quality",
        "promo",
        "price",
        "total_price",
        "note",
      ])
      .populate({
        path: "id_menu",
        select: [
          "name",
          "desc",
          "price",
          "promo",
          "duration",
          "id_category",
          "image",
        ],
      });
    if (!itemOrders) return next(err("load item orders failed"));

    const categories = await Categories.find().select([
      "_id",
      "name",
      "desc",
      "image",
    ]);
    if (!categories) return next(err("load categories failed"));

    const data_itemOrders = itemOrders.map((e) => {
      if (!`${e["id_menu"]["image"]}`.includes("http")) {
        e["id_menu"]["image"] = e["id_menu"]["image"]
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["id_menu"]["image"]}`
          : null;
      }
      return e;
    });

    const data_categories = categories.map((e) => {
      if (!`${e["image"]}`.includes("http")) {
        e["image"] = e["image"]
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["image"]}`
          : null;
      }
      return e;
    });

    const data_orders = orders.map((e) => {
      const order_itemOrders = data_itemOrders.filter(
        (x) => x["id_order"].toString() == e["_id"].toString()
      );
      let temp_categories = [];
      data_categories.forEach((x) => {
        const list_itemOrders = order_itemOrders.filter(
          (z) => x["_id"].toString() == z["id_menu"]["id_category"].toString()
        );
        if (list_itemOrders.length > 0) {
          temp_categories.push({
            _id: x["_id"],
            name: x["name"],
            desc: x["desc"],
            image: x["image"],
            itemOrders: list_itemOrders,
          });
        }
      });

      return {
        _id: e["_id"],
        id_customer: e["id_customer"],
        id_table: e["id_table"],
        categories: temp_categories,
        quality: e["quality"],
        duration: e["duration"],
        promo: e["promo"],
        price: e["price"],
        total_price: e["total_price"],
        note: e["note"],
        status: e["status"],
        estimasi: e["estimasi"],
        expires: e["expires"],
        isExpired: e["isExpired"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
      };
    });

    const data_transactions = transactions.map((e) => {
      const id_account = accounts.find(
        (x) => x["_id"].toString() == e["id_account"].toString()
      );
      const id_order = data_orders.find(
        (x) => x["_id"].toString() == e["id_order"].toString()
      );
      e["id_account"] = id_account;
      e["id_order"] = id_order;

      return {
        _id: e["_id"],
        id_account: id_account,
        id_order: id_order,
        note: e["note"],
        status: e["status"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
        __v: e["__v"],
      };
    });

    return Response.Success(res, "ReadAll", 0, 200, data_transactions);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.findById(req.params._id);
    if (!transactions) return next(err("Transactions not found"));

    const accounts = await Accounts.find()
      .select(["_id", "username", "email", "id_role"])
      .populate({
        path: "id_role",
        select: "name",
      });

    if (!accounts) return next(err("load orders failed"));

    const orders = await Orders.find()
      .select([
        "_id",
        "id_customer",
        "id_table",
        "quality",
        "duration",
        "promo",
        "price",
        "total_price",
        "note",
        "estimasi",
        "expires",
        "status",
        "createdAt",
        "updatedAt",
      ])
      .populate({
        path: "id_table",
        select: "name",
      })
      .populate({
        path: "id_customer",
        select: "username",
      });

    if (!orders) return next(err("load orders failed"));

    const itemOrders = await ItemOrders.find()
      .select([
        "_id",
        "id_menu",
        "id_order",
        "quality",
        "promo",
        "price",
        "total_price",
        "note",
      ])
      .populate({
        path: "id_menu",
        select: [
          "name",
          "desc",
          "price",
          "promo",
          "duration",
          "id_category",
          "image",
        ],
      });
    if (!itemOrders) return next(err("load item orders failed"));

    const categories = await Categories.find().select([
      "_id",
      "name",
      "desc",
      "image",
    ]);
    if (!categories) return next(err("load categories failed"));
    // str.includes("world")
    const data_itemOrders = itemOrders.map((e) => {
      if (!`${e["id_menu"]["image"]}`.includes("http")) {
        e["id_menu"]["image"] = e["id_menu"]["image"]
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["id_menu"]["image"]}`
          : null;
      }
      return e;
    });

    const data_categories = categories.map((e) => {
      if (!`${e["image"]}`.includes("http")) {
        e["image"] = e["image"]
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["image"]}`
          : null;
      }
      return e;
    });

    const data_orders = orders.map((e) => {
      const order_itemOrders = data_itemOrders.filter(
        (x) => x["id_order"].toString() == e["_id"].toString()
      );
      let temp_categories = [];
      data_categories.forEach((x) => {
        const list_itemOrders = order_itemOrders.filter(
          (z) => x["_id"].toString() == z["id_menu"]["id_category"].toString()
        );
        if (list_itemOrders.length > 0) {
          temp_categories.push({
            _id: x["_id"],
            name: x["name"],
            desc: x["desc"],
            image: x["image"],
            itemOrders: list_itemOrders,
          });
        }
      });

      return {
        _id: e["_id"],
        id_customer: e["id_customer"],
        id_table: e["id_table"],
        categories: temp_categories,
        duration: "duration",
        quality: e["quality"],
        promo: e["promo"],
        price: e["price"],
        total_price: e["total_price"],
        note: e["note"],
        status: e["status"],
        estimasi: e["estimasi"],
        expires: e["expires"],
        isExpired: e["isExpired"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
      };
    });

    const id_account = accounts.find(
      (x) => x["_id"].toString() == transactions["id_account"].toString()
    );
    const id_order = data_orders.find(
      (x) => x["_id"].toString() == transactions["id_order"].toString()
    );

    const data_transactions = {
      _id: transactions["_id"],
      id_account: id_account,
      id_order: id_order,
      note: transactions["note"],
      status: transactions["status"],
      createdAt: transactions["createdAt"],
      updatedAt: transactions["updatedAt"],
      __v: transactions["__v"],
    };

    return Response.Success(res, "ReadOne", 0, 200, data_transactions);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    id_account: Joi.string().required(),
    id_order: Joi.string().required(),
    note: Joi.string(),
    payment: Joi.string().equal("cash", "virtual").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const transactions = await Transactions.findOne({
      id_order: body.id_order,
    });
    if (transactions) return next(err("order is already"));

    const account = await Accounts.findById(body.id_account).populate(
      "id_role"
    );
    if (!account) return next(err("account not found"));

    if (!account.id_role.name === "kasir")
      return next(err("account kasir only"));

    const order = await Orders.findById(body.id_order);
    if (!order) return next(err("order not found"));
    //
    const transactionsAll = await Transactions.find().populate("id_order");
    if (!transactionsAll) return next(err("load failed"));

    const data_transaction = transactionsAll.filter((e) => e.status !== "done");
    const duration = data_transaction.reduce((val, e) => {
      return val + Number(e.id_order.duration);
    }, 0);

    const estimasi = new Date(
      Date.now() + parseInt(duration * 60000) + parseInt(order.duration * 60000)
    );

    // return res.json({
    //   estimasi,
    //   duration,
    //   order_daration: order.duration,
    //   expires: order.expires,
    // });

    order.status = body.payment;
    order.estimasi = estimasi;

    const orderUpdate = await Orders.findByIdAndUpdate(body.id_order, order);
    if (!orderUpdate) return next(err("failed update status order"));

    const orderCheck = await Orders.findById(body.id_order);
    if (!orderCheck) return next(err("failed order find"));
    if (orderCheck.status === "pending") return next(err("complete payment"));

    const newData = {
      id_account: account._id,
      id_order: orderCheck._id,
      note: body.note || "",
      status: "pending",
    };

    const newTransactions = await Transactions.create(newData);
    if (!newTransactions) return next(err("Create failed"));
    // socket io
    req.app.io.emit("TransactionsUpdate", "TransactionsUpdate");
    return Response.Success(res, "Create", 0, 200, newTransactions);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    id_account: Joi.string().required(),
    id_order: Joi.string().required(),
    note: Joi.string().required(),
    status: Joi.string().equal("pending", "proses", "done").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const transactions = await Transactions.findById(req.params._id);
    if (!transactions) return next(err("transactions not found"));

    const account = await Accounts.findById(body.id_account);
    if (!account) return next(err("account not found"));

    const order = await Orders.findById(body.id_order);
    if (!order) return next(err("order not found"));

    const newTransactions = {
      id_account: account._id,
      id_order: order._id,
      note: body.note,
      status: body.status,
    };

    const transactionsUpdate = await Transactions.findByIdAndUpdate(
      req.params._id,
      newTransactions
    );
    if (!transactionsUpdate) return next(err("Update failed"));
    // socket io
    req.app.io.emit("TransactionsUpdate", "TransactionsUpdate");
    return Response.Success(res, "Update", 0, 200, transactionsUpdate);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.UpdateStatus = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().equal("pending", "proses", "done").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const transactions = await Transactions.findById(req.params._id);
    if (!transactions) return next(err("transactions not found"));

    transactions.status = body.status;

    const transactionsUpdate = await Transactions.findByIdAndUpdate(
      req.params._id,
      transactions
    );
    if (!transactionsUpdate) return next(err("Update failed"));
    // socket io
    req.app.io.emit("TransactionsUpdate", "TransactionsUpdate");
    return Response.Success(res, "Update", 0, 200, transactionsUpdate);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.findByIdAndDelete(req.params._id);
    if (!transactions) return next(err("Transactions not found"));
    // socket io
    req.app.io.emit("TransactionsUpdate", "TransactionsUpdate");
    return Response.Success(res, "Delete", 0, 200, transactions);
  } catch (err) {
    return next(err(error, 200));
  }
};
