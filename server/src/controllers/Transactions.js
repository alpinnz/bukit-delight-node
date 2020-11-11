const Joi = require("joi");
const { Response } = require("./../middlewares");
const {
  Accounts,
  Tables,
  Orders,
  Transactions,
  ItemOrders,
  Categories,
} = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 300;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.find()
      .populate({ path: "id_account", select: ["username", "id_role"] })
      .populate({
        path: "id_order",
        select: ["customer", "id_table", "note", "status"],
      });
    if (!transactions) return resError(res, "Transactions not found", 400);

    const itemOrders = await ItemOrders.find().populate({
      path: "id_menu",
      select: ["name", "desc", "price", "id_category", "image"],
    });
    if (!itemOrders) return next(err("itemOrder not found"));

    const categories = await Categories.find();
    if (!categories) return next(err("Categories not found"));

    const data = transactions.map((e) => {
      let tempCategories = [];
      let dataTransactions = {
        _id: e["_id"],
        id_account: e["id_account"],
        id_order: e["id_order"],
        categories: [],
        quality: e["quality"],
        price: e["price"],
        note: e["note"],
        status: e["status"],
        createdAt: e["createdAt"],
        updatedAt: e["updatedAt"],
        __v: e["__v"],
      };
      const itemOrdersFilter = itemOrders.filter(
        (i) => i.id_order._id.toString() == e.id_order._id.toString()
      );

      categories.forEach((item) => {
        const dataCategories = {
          _id: item["_id"],
          name: item["name"],
          desc: item["desc"],
          image:
            item["image"] != null
              ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${item["image"]}`
              : null,
          itemOrders: [],
          createdAt: item["createdAt"],
          updatedAt: item["updatedAt"],
          __v: item["__v"],
        };
        const itemOrdersInCategoryFilter = itemOrdersFilter.filter(
          (i) => i.id_menu.id_category.toString() == item._id.toString()
        );
        const itemOrdersMenusAddImage = itemOrdersInCategoryFilter.map(
          (child) => {
            let dataItemOrders = {
              _id: child["_id"],
              id_order: child["id_order"],
              id_menu: {
                _id: child["id_menu"]["_id"],
                name: child["id_menu"]["name"],
                desc: child["id_menu"]["desc"],
                image:
                  child["id_menu"]["image"] != null
                    ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${child["id_menu"]["image"]}`
                    : null,
                price: child["id_menu"]["price"],
              },
              quality: child["quality"],
              price: child["price"],
              note: child["note"],
              createdAt: child["createdAt"],
              updatedAt: child["updatedAt"],
              __v: child["__v"],
            };
            return dataItemOrders;
          }
        );
        dataCategories["itemOrders"] = itemOrdersMenusAddImage;
        if (itemOrdersMenusAddImage.length > 0) {
          tempCategories.push(dataCategories);
        }
      });

      dataTransactions["categories"] = tempCategories;

      return dataTransactions;
    });

    return Response.Success(res, "ReadAll", 0, 200, data);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.findById(req.params._id)
      .populate({ path: "id_account", select: ["username", "id_role"] })
      .populate({
        path: "id_order",
        select: ["customer", "id_table", "note", "status"],
      });
    if (!transactions) return next(err("Transactions not found"));

    const itemOrders = await ItemOrders.find().populate({
      path: "id_menu",
      select: ["name", "desc", "price", "id_category", "image"],
    });
    if (!itemOrders) return next(err("itemOrder not found"));

    const categories = await Categories.find();
    if (!categories) return next(err("Categories not found"));

    let e = transactions;
    let tempCategories = [];
    let dataTransactions = {
      _id: e["_id"],
      id_account: e["id_account"],
      id_order: e["id_order"],
      categories: [],
      quality: e["quality"],
      price: e["price"],
      note: e["note"],
      status: e["status"],
      createdAt: e["createdAt"],
      updatedAt: e["updatedAt"],
      __v: e["__v"],
    };
    const itemOrdersFilter = itemOrders.filter(
      (i) => i.id_order._id.toString() == e.id_order._id.toString()
    );

    categories.forEach((item) => {
      const dataCategories = {
        _id: item["_id"],
        name: item["name"],
        desc: item["desc"],
        image:
          item["image"] != null
            ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${item["image"]}`
            : null,
        itemOrders: [],
        createdAt: item["createdAt"],
        updatedAt: item["updatedAt"],
        __v: item["__v"],
      };
      const itemOrdersInCategoryFilter = itemOrdersFilter.filter(
        (i) => i.id_menu.id_category.toString() == item._id.toString()
      );
      const itemOrdersMenusAddImage = itemOrdersInCategoryFilter.map(
        (child) => {
          let dataItemOrders = {
            _id: child["_id"],
            id_order: child["id_order"],
            id_menu: {
              _id: child["id_menu"]["_id"],
              name: child["id_menu"]["name"],
              desc: child["id_menu"]["desc"],
              image:
                child["id_menu"]["image"] != null
                  ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${child["id_menu"]["image"]}`
                  : null,
              price: child["id_menu"]["price"],
            },
            quality: child["quality"],
            price: child["price"],
            note: child["note"],
            createdAt: child["createdAt"],
            updatedAt: child["updatedAt"],
            __v: child["__v"],
          };
          return dataItemOrders;
        }
      );
      dataCategories["itemOrders"] = itemOrdersMenusAddImage;
      if (itemOrdersMenusAddImage.length > 0) {
        tempCategories.push(dataCategories);
      }
    });

    dataTransactions["categories"] = tempCategories;

    return Response.Success(res, "ReadOne", 0, 200, dataTransactions);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Create = async (req, res, next) => {
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
    const account = await Accounts.findById(body.id_account);
    if (!account) return next(err("account not found"));

    const order = await Orders.findById(body.id_order);
    if (!order) return next(err("order not found"));

    const itemOrder = await ItemOrders.find({ id_order: order._id });
    const quality = await itemOrder.reduce((a, b) => a + b["quality"], 0);
    const price = await itemOrder.reduce((a, b) => a + b["price"], 0);

    const newTransactions = {
      id_account: account._id,
      id_order: order._id,
      quality: quality,
      price: price,
      note: body.note,
      status: body.status,
    };

    const transactions = await Transactions.create(newTransactions);
    if (!transactions) return next(err("Create failed"));
    return Response.Success(res, "Create", 0, 200, transactions);
  } catch (error) {
    return next(err(error, 404));
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

    const itemOrder = await ItemOrders.find({ id_order: order._id });
    const quality = await itemOrder.reduce((a, b) => a + b["quality"], 0);
    const price = await itemOrder.reduce((a, b) => a + b["price"], 0);

    const newTransactions = {
      id_account: account._id,
      id_order: order._id,
      quality: quality,
      price: price,
      note: body.note,
      status: body.status,
    };

    const transactionsUpdate = await Transactions.findByIdAndUpdate(
      req.params._id,
      newTransactions
    );
    if (!transactionsUpdate) return next(err("Update failed"));
    return Response.Success(res, "Update", 0, 200, transactionsUpdate);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.findByIdAndDelete(req.params._id);
    if (!transactions) return next(err("Transactions not found"));
    return Response.Success(res, "Delete", 0, 200, transactions);
  } catch (err) {
    return next(err(error, 404));
  }
};
