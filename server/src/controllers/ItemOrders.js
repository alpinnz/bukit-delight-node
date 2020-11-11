const Joi = require("joi");
const { Response } = require("./../middlewares");
const { Orders, ItemOrders, Menus, Transactions } = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 300;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const itemOrders = await ItemOrders.find()
      .populate({
        path: "id_order",
        select: ["customer", "id_table", "note", "status"],
      })
      .populate({
        path: "id_menu",
        select: ["name", "desc", "image", "price", "id_category"],
      });
    if (!itemOrders) return next(err("ItemOrders not found"));

    return Response.Success(res, "ReadAll", 0, 200, itemOrders);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const itemOrder = await ItemOrders.findById(req.params._id)
      .populate({
        path: "id_order",
        select: ["customer", "id_table", "note", "status"],
      })
      .populate({
        path: "id_menu",
        select: ["name", "desc", "image", "price", "id_category"],
      });
    if (!itemOrder) return next(err("ItemOrder not found"));

    return Response.Success(res, "ReadOne", 0, 200, itemOrder);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    id_order: Joi.string().required(),
    id_menu: Joi.string().required(),
    quality: Joi.number().required(),
    note: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const order = await Orders.findById(body.id_order);
    if (!order) return next(err("order not found"));

    const menu = await Menus.findById(body.id_menu);
    if (!menu) return next(err("menu not found"));

    const transactions = await Transactions.findOne({ id_order: order._id });
    if (transactions) return next(err("Order in transactions"));

    const price = menu.price * body.quality;

    const newItemOrder = {
      id_order: order._id,
      id_menu: menu._id,
      quality: body.quality,
      price: price,
      note: body.note,
    };

    const itemOrder = await ItemOrders.create(newItemOrder);
    if (!itemOrder) return next(err("Create failed"));

    return Response.Success(res, "Create", 0, 200, itemOrder);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    id_order: Joi.string().required(),
    id_menu: Joi.string().required(),
    quality: Joi.number().required(),
    note: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return resError(res, error.details[0].message, 400);
  }

  const body = value;
  try {
    const itemOrder = await ItemOrders.findById(req.params._id);
    if (!itemOrder) return next(err("itemOrder not found"));

    const order = await Orders.findById(body.id_order);
    if (!order) return next(err("order not found"));

    const menu = await Menus.findById(body.id_menu);
    if (!menu) return next(err("menu not found"));

    const price = menu.price * body.quality;

    const newItemOrder = {
      id_order: order._id,
      id_menu: menu._id,
      quality: body.quality,
      price: price,
      note: body.note,
    };

    const itemOrderUpdate = await ItemOrders.findByIdAndUpdate(
      req.params._id,
      newItemOrder
    );
    if (!itemOrderUpdate) return next(err("failed update"));

    const itemOrderCheck = await ItemOrders.findById(req.params._id);
    if (!itemOrderCheck) return next(err("failed update"));

    return Response.Success(res, "Update", 0, 200, itemOrderCheck);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const itemOrders = await ItemOrders.findByIdAndDelete(req.params._id);

    if (!itemOrders) return next(err("ItemOrder not found"));
    return Response.Success(res, "Delete", 0, 200, itemOrders);
  } catch (error) {
    return next(err(error, 404));
  }
};
