const Joi = require("joi");
const { Response } = require("./../middlewares");
const {
  Tables,
  Orders,
  ItemOrders,
  Menus,
  Categories,
  Transactions,
} = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const itemOrders = await ItemOrders.find().populate({
      path: "id_menu",
      select: ["name", "desc", "price", "id_category", "image"],
    });
    if (!itemOrders) return next(err("itemOrder not found"));
    const categories = await Categories.find();
    if (!categories) return next(err("Categories not found"));

    const orders = await Orders.find().populate({
      path: "id_table",
      select: "name",
    });
    if (!orders) return next(err("Orders not found"));

    let data = [];

    orders.forEach((e) => {
      let dataItemOrders = [];
      itemOrders.forEach((item) => {
        let dataItems = {
          _id: item["_id"],
          id_order: item["id_order"],
          id_menu: {
            _id: item["id_menu"]["_id"],
            name: item["id_menu"]["name"],
            desc: item["id_menu"]["desc"],
            image:
              item["id_menu"]["image"] != null
                ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${item["id_menu"]["image"]}`
                : null,
            price: item["id_menu"]["price"],
            id_category: item["id_menu"]["id_category"],
          },
          quality: item["quality"],
          price: item["price"],
          note: item["note"],
          createdAt: item["createdAt"],
          updatedAt: item["updatedAt"],
          __v: item["__v"],
        };
        if (e["_id"].toString() == item["id_order"].toString()) {
          dataItemOrders.push(dataItems);
        }
      });

      const dataCategories = [];
      categories.forEach((e) => {
        const dataFilter = dataItemOrders.filter(
          (i) => i["id_menu"]["id_category"].toString() == e["_id"].toString()
        );

        const dataResult = {
          _id: e["_id"],
          name: e["name"],
          desc: e["desc"],
          image:
            e["image"] != null
              ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["image"]}`
              : null,
          itemOrders: dataFilter,
          createdAt: e["createdAt"],
          updatedAt: e["updatedAt"],
          __v: e["__v"],
        };
        dataCategories.push(dataResult);
      });

      let result = {
        _id: e["_id"],
        customer: e["customer"],
        id_table: e["id_table"],
        categories: dataCategories,
        note: e["note"],
        status: e["status"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
        __v: e["__v"],
      };

      data.push(result);
    });

    return Response.Success(res, "ReadAll", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;

    const order = await Orders.findById(req.params._id).populate({
      path: "id_table",
      select: "name",
    });
    if (!order) return next(err("Orders not found"));

    const itemOrders = await ItemOrders.find({ id_order: order }).populate({
      path: "id_menu",
      select: ["name", "desc", "price", "id_category", "image"],
    });
    if (!itemOrders) return next(err("itemOrder not found"));
    const categories = await Categories.find();
    if (!categories) return next(err("Categories not found"));

    const dataItemOrders = itemOrders.map((e) => {
      let dataItems = {
        _id: e["_id"],
        id_order: e["id_order"],
        id_menu: {
          _id: e["id_menu"]["_id"],
          name: e["id_menu"]["name"],
          desc: e["id_menu"]["desc"],
          image:
            e["id_menu"]["image"] != null
              ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["id_menu"]["image"]}`
              : null,
          price: e["id_menu"]["price"],
          id_category: e["id_menu"]["id_category"],
        },
        quality: e["quality"],
        price: e["price"],
        note: e["note"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
        __v: e["__v"],
      };
      return dataItems;
    });

    const dataCategories = [];
    categories.forEach((e) => {
      const dataFilter = dataItemOrders.filter(
        (i) => i["id_menu"]["id_category"].toString() == e["_id"].toString()
      );

      let dataResult = {
        _id: e["_id"],
        name: e["name"],
        desc: e["desc"],
        image:
          e["image"] != null
            ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["image"]}`
            : null,
        itemOrders: dataFilter,
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
        __v: e["__v"],
      };
      dataCategories.push(dataResult);
    });

    const data = {
      _id: order["_id"],
      customer: order["customer"],
      id_table: order["id_table"],
      categories: dataCategories,
      note: order["note"],
      status: order["status"],
      createdAt: order["createdAt"],
      updatedAt: order["updatedAt"],
      __v: order["__v"],
    };
    return Response.Success(res, "ReadOne", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    customer: Joi.string().required(),
    id_table: Joi.string().required(),
    note: Joi.string().required(),
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
    const table = await Tables.findById(body.id_table);
    if (!table) return next(err("table not found"));

    const newOrder = {
      customer: body.customer,
      id_table: table._id,
      note: body.note,
      status: "pending",
    };

    const order = await Orders.create(newOrder);
    if (!order) return next(err("Create failed"));

    const menu = await Menus.find();
    if (!menu) return next(err("Menu not found"));

    let newItemOrdersList = [];
    let newItemOrdersListNotFound = [];

    await body.Menus.forEach((e) => {
      const menuSelect = menu.find((i) => i._id == e.id_menu);
      if (menuSelect) {
        e["price"] = menuSelect["price"] * e["quality"];
        e["id_order"] = order._id;
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

    // const newItemOrdersList = await body.Menus.map((e) => {
    //   const menuSelect = menu.find((i) => i._id == e.id_menu);
    //   if (e["price"] || e["id_order"]) {
    //     e["price"] = menuSelect["price"] * e["quality"];
    //     e["id_order"] = order._id;
    //     return e;
    //   }
    // });

    const itemOrders = await ItemOrders.insertMany(newItemOrdersList);
    if (!itemOrders) return next(err("Failed itemOrders"));
    const data = {
      _id: order["_id"],
      customer: order["customer"],
      id_table: order["id_table"],
      itemOrde: itemOrders,
      note: order["note"],
      status: order["status"],
      createdAt: order["createdAt"],
      updatedAt: order["updatedAt"],
      __v: order["__v"],
    };

    return Response.Success(res, "Create", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.UpdateStatus = async (req, res, next) => {
  const schema = Joi.object({
    id_table: Joi.string().required(),
    note: Joi.string().required(),
    status: Joi.string().equal("pending", "payment").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const order = await Orders.findById(req.params._id);
    if (!order) return next(err("order not found"));

    const table = await Tables.findById(body.id_table);
    if (!table) return next(err("table not found"));

    const transactions = await Transactions.findOne({
      id_order: req.params._id,
    });
    if (transactions) return next(err("Order in transactions"));

    order.id_table = table._id;
    order.note = body.note;
    order.status = body.status;

    const orderUpdate = await Orders.findByIdAndUpdate(req.params._id, order);
    if (!orderUpdate) return next(err("failed update"));

    const orderCheck = await Orders.findById(req.params._id);
    if (!orderCheck) return next(err("failed update"));

    return Response.Success(res, "UpdateItemOrders", 0, 200, orderCheck);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    customer: Joi.string().required(),
    id_table: Joi.string().required(),
    note: Joi.string().required(),
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

    const order = await Orders.findById(req.params._id).populate({
      path: "id_table",
      select: "name",
    });
    if (!order) return next(err("Orders not found"));

    const table = await Tables.findById(body.id_table);
    if (!table) return next(err("table not found"));

    const newOrder = {
      customer: body.customer,
      id_table: table._id,
      note: body.note,
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
        e["price"] = menuSelect["price"] * e["quality"];
        e["id_order"] = order._id;
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
      customer: order["customer"],
      id_table: order["id_table"],
      itemOrders: itemOrders,
      note: order["note"],
      status: order["status"],
      createdAt: order["createdAt"],
      updatedAt: order["updatedAt"],
      __v: order["__v"],
    };

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
    return Response.Success(res, "Delete", 0, 200, order);
  } catch (err) {
    return next(err(error, 200));
  }
};
