const Joi = require("joi");
const { Response } = require("./../middlewares");
const { Tables } = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const tables = await Tables.find();
    if (!tables) return next(err("Tables not found"));
    return Response.Success(res, "ReadAll", 0, 200, tables);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const table = await Tables.findById(req.params._id);
    if (!table) return next(err("Table not found"));
    return Response.Success(res, "ReadOne", 0, 200, table);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return next(err(error.details[0].message));

  const body = value;
  try {
    const regexName = new RegExp(["^", body.name, "$"].join(""), "i");
    const validName = await Tables.findOne({ name: regexName });
    if (validName) return next(err("Name is already"));

    const newTable = {
      name: body.name.toLowerCase(),
    };

    const table = await Tables.create(newTable);
    if (!table) return next(err("Create failed"));
    const data = {
      name: table.name,
    };
    // socket io
    req.app.io.emit("TablesUpdate", "TablesUpdate");
    return Response.Success(res, "Create", 0, 200, data);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return resError(res, error.details[0].message, 400);
  }

  const body = value;
  try {
    const regexName = new RegExp(["^", body.name, "$"].join(""), "i");
    const validName = await Tables.findOne({ name: regexName });
    if (validName) {
      if (validName._id !== req.params._id) return next(err("Name is already"));
    }

    const table = await Tables.findById(req.params._id);
    if (!table) return next(err("Table not found"));
    const newTable = {
      name: body.name.toLowerCase(),
    };
    const tableUpdate = await Tables.findByIdAndUpdate(
      req.params._id,
      newTable
    );
    if (!tableUpdate) return next(err("Failed update"));

    const tableCheck = await Tables.findById(req.params._id);
    if (!tableCheck) return next(err("Failed update"));

    const data = {
      name: tableCheck.name,
    };
    // socket io
    req.app.io.emit("TablesUpdate", "TablesUpdate");
    return Response.Success(res, "Update", 0, 200, data);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const table = await Tables.findByIdAndDelete(req.params._id);
    if (!table) return next(err("Table not found"));
    // socket io
    req.app.io.emit("TablesUpdate", "TablesUpdate");
    return Response.Success(res, "Delete", 0, 200, table);
  } catch (error) {
    return next(err(error), 200);
  }
};
