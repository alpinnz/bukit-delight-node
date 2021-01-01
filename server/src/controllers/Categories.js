const Joi = require("joi");
const { Response } = require("./../middlewares");
const { Categories } = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const categories = await Categories.find();
    if (!categories) return next(err("Category not found"));
    const newCategories = categories.map((e) => {
      e["image"] =
        e.image != null
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e.image}`
          : null;
      return e;
    });
    return Response.Success(res, "Categories", 0, 200, newCategories);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const category = await Categories.findById(req.params._id);
    if (!category) return next(err("Category not found"));
    category["image"] =
      category.image != null
        ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${category.image}`
        : null;
    return Response.Success(res, "Category", 0, 200, category);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Create = async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(err(error.details[0].message));
  }

  if (!req.file) return next(err("required image"));
  if (req.file.fieldname !== "image") return next(err("required image"));

  const body = value;
  try {
    const regexName = new RegExp(["^", body.name, "$"].join(""), "i");
    const validName = await Categories.findOne({ name: regexName });
    if (validName) {
      return next(err("Name is already"));
    }

    const newCategory = {
      name: body.name.toUpperCase(),
      desc: body.desc,
      image: req.file.filename,
    };

    const category = await Categories.create(newCategory);
    if (!category) {
      return next(err("Create failed"));
    }
    const data = {
      name: category.name,
      desc: category.desc,
      image: category.image,
    };
    return Response.Success(res, "Create", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(err(error.details[0].message));
  }

  const body = value;
  try {
    const regexName = new RegExp(["^", body.name, "$"].join(""), "i");
    const validName = await Categories.findOne({ name: regexName });
    if (validName && validName._id != req.params._id) {
      return next(err("Name is already"));
    }

    const category = await Categories.findById(req.params._id);
    if (!category) return next(err("Category not found"));

    let image = category.image;
    if (req.file) {
      if (req.file.fieldname !== "image") {
        image = req.file.filename;
      }
    }

    const newCategory = {
      name: body.name.toUpperCase(),
      desc: body.desc,
      image: image,
    };

    const categoryUpdate = await Categories.findByIdAndUpdate(
      req.params._id,
      newCategory
    );
    if (!categoryUpdate) return next(err("Update failed"));

    const categoryCheck = await Categories.findById(req.params._id);
    if (!categoryCheck) return next(err("Update failed"));

    const data = {
      name: categoryCheck.name,
      desc: categoryCheck.desc,
      image: categoryCheck.image,
    };
    return Response.Success(res, "Update", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const category = await Categories.findByIdAndDelete(req.params._id);

    if (!category) return next(err("Category not found", 200));
    return Response.Success(res, "Delete", 0, 200, category);
  } catch (error) {
    return next(err(error, 200));
  }
};
