const Joi = require("joi");
const { Response } = require("./../middlewares");
const { Customers } = require("./../models");
// const { HashPassword } = require("./../services/Authentication");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const customers = await Customers.find();
    if (!customers) return next(err("Customers not found"));
    return Response.Success(res, "Customers", 0, 200, customers);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const customer = await Customers.findById(req.params._id);
    if (!customer) return next(err("Customer not found"));
    return Response.Success(res, "Customer", 0, 200, customer);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    // mac: Joi.string().required(),
    // password: Joi.string().required(),
    // repeat_password: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(err(error.details[0].message));
  }

  const body = value;
  try {
    // const regexMac = new RegExp(["^", body.mac, "$"].join(""), "i");
    // const validMac = await Accounts.findOne({ mac: regexMac });
    // if (validMac) {
    //   return next(err("Mac is already"));
    // }

    // const hashPassword = await HashPassword(body.password);

    const newCustomer = {
      username: body.username,
      // mac: body.mac.toLowerCase(),
      // password: hashPassword,
    };

    const customer = await Customers.create(newCustomer);
    if (!customer) {
      return next(err("Register failed"));
    }
    const data = {
      username: customer.username,
      // mac: customer.mac,
    };
    // socket io
    req.app.io.emit("CustomersUpdate", "CustomersUpdate");
    return Response.Success(res, "Register", 0, 200, customer);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    // mac: Joi.string().required(),
    // password: Joi.string().required(),
    // repeat_password: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(err(res, error.details[0].message));
  }

  const body = value;
  try {
    const customer = await Customers.findById(req.params._id);
    if (!customer) {
      return next(err("Customer not found"));
    }

    // const regexMac = new RegExp(["^", body.mac, "$"].join(""), "i");
    // const validMac = await Customers.findOne({ mac: regexMac });
    // if (validMac) {
    //   if (validMac._id.toString() !== req.params._id.toString()) {
    //     return next(err("Mac is already"));
    //   }
    // }

    customer.username = body.username;
    // customer.mac = body.mac.toLowerCase();
    // if (body.password) {
    //   const hashPassword = await HashPassword(body.password);
    //   customer.password = hashPassword;
    // }

    const customerUpdate = await Customers.findByIdAndUpdate(
      req.params._id,
      customer
    );
    if (!customerUpdate) {
      return next(err("Update failed"));
    }
    const customerCheck = await Customers.findById(req.params._id);
    if (!customerCheck) {
      return next(err("Update failed"));
    }
    const data = {
      username: accountCheck.username,
      // mac: accountCheck.mac,
    };
    // socket io
    req.app.io.emit("CustomersUpdate", "CustomersUpdate");
    return Response.Success(res, "Update", 0, 200, accountCheck);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const customer = await Customers.findByIdAndDelete(req.params._id);
    if (!customer) return next(err("Customer not found"));
    // socket io
    req.app.io.emit("CustomersUpdate", "CustomersUpdate");
    return Response.Success(res, "Delete", 0, 200, customer);
  } catch (error) {
    return next(err(error), 200);
  }
};
