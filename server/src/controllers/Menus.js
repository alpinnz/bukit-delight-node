const Joi = require("joi");
const { Response } = require("./../middlewares");
const { Categories, Menus } = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 300;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const menus = await Menus.find().populate({
      path: "id_category",
      select: ["name", "desc", "image"],
    });
    if (!menus) return next(err("Menus not found"));
    const newMenus = menus.map((e) => {
      e["image"] =
        e.image != null
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e.image}`
          : null;
      return e;
    });
    return Response.Success(res, "ReadAll", 0, 200, newMenus);
  } catch (error) {
    return next(err(error), 404);
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const menu = await Menus.findById(req.params._id).populate({
      path: "id_category",
      select: ["name", "desc", "image"],
    });
    if (!menu) return next(err("Menu not found"));
    menu["image"] =
      menu.image != null
        ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${menu.image}`
        : null;
    return Response.Success(res, "ReadOne", 0, 200, menu);
  } catch (error) {
    return next(err(error), 404);
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    id_category: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  if (!req.file) return next(err("required image"));
  if (req.file.fieldname !== "image") return next(err("required image"));

  const body = value;
  try {
    const regexName = new RegExp(["^", body.name, "$"].join(""), "i");
    const validName = await Menus.findOne({ name: regexName });
    if (validName) return next(err("Name is already"));

    const category = await Categories.findById(body.id_category);
    if (!category) return next(err("Category not found"));

    const newMenu = {
      name: body.name,
      desc: body.desc,
      image: req.file.filename,
      price: body.price,
      id_category: category._id,
    };

    const menu = await Menus.create(newMenu);
    if (!menu) return next(err("Create failed"));

    const data = {
      name: menu.name,
      desc: menu.desc,
      image: menu.image,
      price: menu.price,
      category: category.name,
    };
    return Response.Success(res, "Create", 0, 200, data);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    id_category: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const regexName = new RegExp(["^", body.name, "$"].join(""), "i");
    const validName = await Menus.findOne({ name: regexName });
    if (validName && validName._id != req.params._id) {
      return next(err("Name is already"));
    }

    const menu = await Menus.findById(req.params._id);
    if (!menu) return next(err("Menu not found"));

    const category = await Categories.findById(body.id_category);
    if (!category) return next(err("Category not found"));

    let image = menu.image;
    if (req.file) {
      if (req.file.fieldname !== "image") {
        image = req.file.filename;
      }
    }

    const newMenu = {
      name: body.name,
      desc: body.desc,
      image: image,
      price: body.price,
      id_category: category._id,
    };

    const menusUpdate = await Menus.findByIdAndUpdate(req.params._id, newMenu);
    if (!menusUpdate) return next(err("Update failed"));

    const menuCheck = await Menus.findById(req.params._id);
    if (!menuCheck) return next(err("Update failed"));

    const data = {
      name: menuCheck.name,
      desc: menuCheck.desc,
      image: menuCheck.image,
      price: menuCheck.price,
      category: category.name,
    };
    return Response.Success(res, "Update", 0, 200, data);
  } catch (error) {
    return next(err(error, 404));
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const menu = await Menus.findByIdAndDelete(req.params._id);

    if (!menu) return next(err("Menu not found"));
    return Response.Success(res, "Delete", 0, 200, menu);
  } catch (error) {
    return next(err(error, 404));
  }
};
