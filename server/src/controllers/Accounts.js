const Joi = require("joi");
const { Response } = require("./../middlewares");
const { Accounts, Roles } = require("./../models");
const { HashPassword } = require("./../services/Authentication");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const accounts = await Accounts.find().populate({
      path: "id_role",
      select: "name",
    });
    if (!accounts) return next(err("Accounts not found"));
    return Response.Success(res, "Accounts", 0, 200, accounts);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.ReadOne = async (req, res, next) => {
  try {
    const {} = req.body;
    const accounts = await Accounts.findById(req.params._id).populate({
      path: "id_role",
      select: "name",
    });
    if (!accounts) return next(err("Accounts not found"));
    return Response.Success(res, "Accounts", 0, 200, accounts);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Create = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    id_role: Joi.string().required(),
    password: Joi.string().required(),
    repeat_password: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(err(error.details[0].message));
  }

  const body = value;
  try {
    const regexUsername = new RegExp(["^", body.username, "$"].join(""), "i");
    const validUseranme = await Accounts.findOne({ username: regexUsername });
    if (validUseranme) {
      return next(err("Username is already"));
    }

    const regexEmail = new RegExp(["^", body.email, "$"].join(""), "i");
    const validEmail = await Accounts.findOne({ email: regexEmail });
    if (validEmail) {
      return next(err("Email is already"));
    }

    const role = await Roles.findById(body.id_role);
    if (!role) {
      return next(err("Role not found"));
    }
    const hashPassword = await HashPassword(body.password);

    const newAccount = {
      username: body.username,
      email: body.email.toLowerCase(),
      password: hashPassword,
      id_role: role._id,
    };

    const account = await Accounts.create(newAccount);
    if (!account) {
      return next(err("Register failed"));
    }
    const data = {
      username: account.username,
      email: account.email,
      role: role.name,
    };
    return Response.Success(res, "Register", 0, 200, data);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Update = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    id_role: Joi.string().required(),
    password: Joi.string().required(),
    repeat_password: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(err(res, error.details[0].message));
  }

  const body = value;
  try {
    const account = await Accounts.findById(req.params._id);
    if (!account) {
      return next(err("Account not found"));
    }

    const regexUsername = new RegExp(["^", body.username, "$"].join(""), "i");
    const validUseranme = await Accounts.findOne({ username: regexUsername });
    console.log({ valid: validUseranme._id });
    console.log({ _id: req.params._id });
    if (validUseranme) {
      if (validUseranme._id.toString() !== req.params._id.toString()) {
        return next(err("Username is already"));
      }
    }

    const regexEmail = new RegExp(["^", body.email, "$"].join(""), "i");
    const validEmail = await Accounts.findOne({ email: regexEmail });
    if (validEmail) {
      if (validEmail._id.toString() !== req.params._id.toString()) {
        return next(err("Email is already"));
      }
    }

    const role = await Roles.findById(body.id_role);
    if (!role) {
      return next(err("Role not found"));
    }
    const hashPassword = await HashPassword(body.password);

    const newAccount = {
      username: body.username,
      email: body.email.toLowerCase(),
      password: hashPassword,
      id_role: role._id,
    };

    const accountUpdate = await Accounts.findByIdAndUpdate(
      req.params._id,
      newAccount
    );
    if (!accountUpdate) {
      return next(err("Update failed"));
    }
    const accountCheck = await Accounts.findById(req.params._id);
    if (!accountCheck) {
      return next(err("Update failed"));
    }
    const data = {
      username: accountCheck.username,
      email: accountCheck.email,
      id_role: role.name,
    };
    return Response.Success(res, "Update", 0, 200, data);
  } catch (error) {
    return next(err(error), 200);
  }
};

exports.Delete = async (req, res, next) => {
  try {
    const {} = req.body;
    const accounts = await Accounts.findByIdAndDelete(req.params._id);
    if (!accounts) return next(err("Accounts not found"));
    return Response.Success(res, "Delete", 0, 200, accounts);
  } catch (error) {
    return next(err(error), 200);
  }
};
