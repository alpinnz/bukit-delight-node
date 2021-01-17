const Joi = require("joi");
const { Response } = require("./../middlewares");
const {
  Tables,
  Orders,
  ItemOrders,
  Menus,
  Categories,
  Transactions,
  Customers,
} = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;

    const orders = await Orders.find()
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
          "id_category",
          "duration",
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
        expires: e["expires"],
        isExpired: e["isExpired"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
        __v: e["__v"],
      };
    });

    return Response.Success(res, "ReadAll", 0, 200, data_orders);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;

    const order = await Orders.findById(req.params._id)
      .populate({
        path: "id_table",
        select: "name",
      })
      .populate({
        path: "id_customer",
        select: "username",
      });
    if (!order) return next(err("load order failed"));

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
          "id_category",
          "duration",
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

    const order_itemOrders = data_itemOrders.filter(
      (x) => x["id_order"].toString() == order["_id"].toString()
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

    const data_order = {
      _id: order["_id"],
      id_customer: order["id_customer"],
      id_table: order["id_table"],
      categories: temp_categories,
      quality: order["quality"],
      duration: order["duration"],
      promo: order["promo"],
      price: order["price"],
      total_price: order["total_price"],
      note: order["note"],
      status: order["status"],
      expires: order["expires"],
      isExpired: order["isExpired"],
      createdAt: order["createdAt"],
      updatedAt: order["updatedAt"],
      __v: order["__v"],
    };

    return Response.Success(res, "ReadOne", 0, 200, data_order);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    id_customer: Joi.string().required(),
    id_table: Joi.string().required(),
    note: Joi.string(),
    Menus: Joi.array()
      .items({
        id_menu: Joi.string().required(),
        quality: Joi.string().required(),
        note: Joi.string(),
      })
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;

  try {
    const customer = await Customers.findById(body.id_customer);
    if (!customer) return next(err("customer not found"));

    const table = await Tables.findById(body.id_table);
    if (!table) return next(err("table not found"));

    const expires = new Date(Date.now() + parseInt(process.env.ORDERS_TIMEOUT));

    const newOrder = {
      id_customer: customer._id,
      id_table: table._id,
      quality: 0,
      promo: 0,
      price: 0,
      duration: 0,
      total_price: 0,
      note: body.note || "",
      status: "pending",
      estimasi: expires,
      expires: expires,
    };

    const order = await Orders.create(newOrder);
    if (!order) return next(err("Create failed"));
    // return res.json(order);

    const menu = await Menus.find();
    if (!menu) return next(err("Menu not found"));

    let newItemOrdersList = [];
    let newItemOrdersListNotFound = [];

    await body.Menus.forEach((e) => {
      const menuSelect = menu.find((i) => i._id == e.id_menu);
      if (menuSelect) {
        e["duration"] = menuSelect["duration"] * e["quality"];
        e["promo"] = menuSelect["promo"] * e["quality"];
        e["price"] = menuSelect["price"] * e["quality"];
        e["total_price"] = e["price"] - e["promo"];
        e["id_order"] = order._id;
        e["note"] = e["note"] ? e["note"] : "";
        newItemOrdersList.push(e);
      } else {
        newItemOrdersListNotFound.push(e.id_menu);
      }
    });

    if (newItemOrdersList.length != body.Menus.length) {
      return next(
        err(`Menu item not match : ${newItemOrdersListNotFound.join(",")}`)
      );
    }
    if (newItemOrdersList.length <= 0) return next(err("Menu item not found"));

    const itemOrders = await ItemOrders.insertMany(newItemOrdersList);
    if (!itemOrders) return next(err("Failed itemOrders"));

    const quality = await newItemOrdersList.reduce((val, element) => {
      return val + Number(element.quality);
    }, 0);

    const duration = await newItemOrdersList.reduce((val, element) => {
      return val + Number(element.duration);
    }, 0);

    const promo = await newItemOrdersList.reduce((val, element) => {
      return val + Number(element.promo);
    }, 0);

    const price = await newItemOrdersList.reduce((val, element) => {
      return val + Number(element.price);
    }, 0);
    const total_price = await newItemOrdersList.reduce((val, element) => {
      return val + Number(element.total_price);
    }, 0);

    const updateOrder = {
      id_customer: customer._id,
      id_table: table._id,
      quality: quality,
      duration: duration,
      promo: promo,
      price: price,
      total_price: total_price,
      note: body.note || "",
      status: "pending",
      estimasi: expires,
      expires: expires,
    };

    const orderUpdate = await Orders.findByIdAndUpdate(order._id, updateOrder);
    if (!orderUpdate) return next(err("Update failed"));

    let orderCheck = await Orders.findById(order._id)
      .populate({
        path: "id_table",
        select: "name",
      })
      .populate({
        path: "id_customer",
        select: "username",
      });
    if (!orderCheck) return next(err("Update failed"));

    orderCheck["itemOrde"] = itemOrders;

    const data = {
      _id: orderCheck["_id"],
      id_customer: orderCheck["id_customer"],
      id_table: orderCheck["id_table"],
      itemOrder: itemOrders,
      quality: orderCheck["quality"],
      duration: orderCheck["duration"],
      promo: orderCheck["promo"],
      price: orderCheck["price"],
      total_price: orderCheck["total_price"],
      note: orderCheck["note"],
      status: orderCheck["status"],
      estimasi: orderCheck["estimasi"],
      expires: orderCheck["expires"],
      createdAt: orderCheck["createdAt"],
      updatedAt: orderCheck["updatedAt"],
      __v: orderCheck["__v"],
    };

    // socket io
    req.app.io.emit("OrdersUpdate", "OrdersUpdate");
    return Response.Success(res, "Create", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.UpdateStatus = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().equal("pending", "cash", "virtual").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const order = await Orders.findById(req.params._id);
    if (!order) return next(err("order not found"));

    const transactions = await Transactions.findOne({
      id_order: req.params._id,
    });
    if (transactions) return next(err("Order in transactions"));

    order.status = body.status;

    const orderUpdate = await Orders.findByIdAndUpdate(req.params._id, order);
    if (!orderUpdate) return next(err("failed update"));

    const orderCheck = await Orders.findById(req.params._id);
    if (!orderCheck) return next(err("failed update"));

    // socket io
    req.app.io.emit("OrdersUpdate", "OrdersUpdate");
    return Response.Success(res, "OrdersUpdateStatus", 0, 200, orderCheck);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    id_customer: Joi.string().required(),
    id_table: Joi.string().required(),
    note: Joi.string(),
    Menus: Joi.array()
      .items({
        id_menu: Joi.string().required(),
        quality: Joi.string().required(),
        note: Joi.string().required(),
      })
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;

  try {
    const transactions = await Transactions.findOne({
      id_order: req.params._id,
    });
    if (transactions) return next(err("Order in transactions"));

    const order = await Orders.findById(req.params._id)
      .populate({
        path: "id_table",
        select: "name",
      })
      .populate({
        path: "id_customer",
        select: "username",
      });
    if (!order) return next(err("Orders not found"));

    const customer = await Customers.findById(body.id_customer);
    if (!customer) return next(err("customer not found"));

    const table = await Tables.findById(body.id_table);
    if (!table) return next(err("table not found"));

    const newOrder = {
      id_customer: customer._id,
      id_table: table._id,
      note: body.note || "",
      status: "pending",
    };

    const orderUpdate = await Orders.findByIdAndUpdate(
      req.params._id,
      newOrder
    );
    if (!orderUpdate) return next(err("Update failed"));

    const menu = await Menus.find();
    if (!menu) return next(err("Menu not found"));

    const itemOrdersRemove = await ItemOrders.deleteMany({
      id_order: order["_id"],
    });
    if (!itemOrdersRemove) return next(err("Failed Remove itemOrders"));

    // const newItemOrdersList = await body.Menus.map((e) => {
    //   const menuSelect = menu.find((i) => i._id == e.id_menu);
    //   e["price"] = menuSelect["price"] * e["quality"];
    //   e["id_order"] = order._id;
    //   return e;
    // });

    let newItemOrdersList = [];
    let newItemOrdersListNotFound = [];

    await body.Menus.forEach((e) => {
      const menuSelect = menu.find((i) => i._id == e.id_menu);
      if (menuSelect) {
        e["promo"] = menuSelect["promo"] * e["quality"];
        e["price"] = menuSelect["price"] * e["quality"];
        e["total_price"] = e["price"] - e["promo"];
        e["id_order"] = order._id;
        e["note"] = e["note"] ? e["note"] : "";
        newItemOrdersList.push(e);
      } else {
        newItemOrdersListNotFound.push(e.id_menu);
      }
    });
    if (newItemOrdersList.length <= 0) return next(err("Menu item not found"));

    if (newItemOrdersList.length != body.Menus.length) {
      return next(
        err(`Menu item not match : ${newItemOrdersListNotFound.join(",")}`)
      );
    }

    const itemOrders = await ItemOrders.insertMany(newItemOrdersList);
    if (!itemOrders) return next(err("Failed itemOrders"));

    const data = {
      _id: order["_id"],
      id_customer: order["id_customer"],
      id_table: order["id_table"],
      itemOrders: itemOrders,
      note: order["note"],
      status: order["status"],
      createdAt: order["createdAt"],
      updatedAt: order["updatedAt"],
      __v: order["__v"],
    };

    // socket io
    req.app.io.emit("OrdersUpdate", "OrdersUpdate");
    return Response.Success(res, "Create", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const order = await Orders.findByIdAndDelete(req.params._id);

    if (!order) return next(err("Table not found"));
    // socket io
    req.app.io.emit("OrdersUpdate", "OrdersUpdate");
    return Response.Success(res, "Delete", 0, 200, order);
  } catch (err) {
    return next(err(error, 200));
  }
};
