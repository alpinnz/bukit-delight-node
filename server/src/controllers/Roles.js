const { Response } = require("./../middlewares");
const { Roles } = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.ReadAll = async (req, res, next) => {
  try {
    const {} = req.body;
    const roles = await Roles.find();
    if (!roles) return next(err("Roles not found"));
    return Response.Success(res, "Roles", 0, 200, roles);
  } catch (error) {
    return next(err(error), 200);
  }
};
