const { Response } = require("./../middlewares");
const Joi = require("joi");
const { Accounts, Roles, RefreshTokens, ObjectId } = require("./../models");
const { sendForgotPassword } = require("./../config/Nodemailer");
const {
  HashPassword,
  VerifyHashPassword,
  JwtAccessToken,
  JwtRefreshTokenCreate,
  JwtRefreshTokenReplaced,
  SetAccessTokenCookie,
  SetRefreshTokenCookie,
  VerifyRefreshToken,
  RevokeToken,
  JwtResetPasswordToken,
  VerifyResetPasswordToken,
} = require("./../services/Authentication");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.Register = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
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

    const role = await Roles.findOne({ name: "user" });
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
    };
    return Response.Success(res, "Register", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Login = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return next(err(error.details[0].message));
  }

  const body = value;

  try {
    const ipAddress = req.ip;
    const regex = new RegExp(["^", body.username, "$"].join(""), "i");
    const account = await Accounts.findOne({ username: regex });
    if (!account) {
      return next(err("Useranme or password is incorrect"));
    }
    const passIsValid = await VerifyHashPassword(
      body.password,
      account.password
    );
    if (!passIsValid) {
      return next(err("Useranme or password is incorrect"));
    }

    const role = await Roles.findById(account.id_role);
    if (!role) {
      return next(err("Useranme or password is incorrect"));
    }

    const accessToken = await JwtAccessToken(account);
    if (!accessToken) {
      return next(err("Token Error"));
    }

    SetAccessTokenCookie(res, accessToken);

    const refreshToken = await JwtRefreshTokenCreate(account, ipAddress);
    if (!refreshToken) {
      return next(err("Refresh Token Error"));
    }

    SetRefreshTokenCookie(res, refreshToken);
    const data = {
      email: account.email,
      role: role.name,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return Response.Success(res, "Login", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.RefreshToken = async (req, res, next) => {
  try {
    const ipAddress = req.ip;

    // let refreshToken = req.headers["x-refresh-token"];
    // if (req.headers["x-refresh-token"]) {
    //   await RefreshTokens.findOne({
    //     token: req.headers["x-refresh-token"],
    //   })
    //     .then((data) => {
    //       refreshToken = data;
    //     })
    //     .catch((err) => {});
    // }

    // if (!refreshToken || !refreshToken.isActive) {
    // } else {
    //   if (req.cookies["x-refresh-token"]) {
    //     await RefreshTokens.findOne({
    //       token: req.cookies["x-refresh-token"],
    //     })
    //       .then((data) => {
    //         refreshToken = data;
    //       })
    //       .catch((err) => {});
    //     if (!refreshToken || !refreshToken.isActive) {
    //       return next(err("Invalid token", 401));
    //     }
    //   }
    // }

    let refreshToken = await RefreshTokens.findOne({
      token: req.headers["x-refresh-token"],
    });
    if (!refreshToken) return next(err("Invalid token", 401));

    const decode = await VerifyRefreshToken(refreshToken.token);
    if (!decode) return next(err("Invalid token", 401));

    const account = await Accounts.findById(decode.id);
    if (!account) return next(err("Failed account not found", 401));

    const role = await Roles.findById(account.id_role);
    if (!role) {
      return next(err("Role account not found", 401));
    }

    const newRefreshToken = await JwtRefreshTokenReplaced(
      account,
      ipAddress,
      refreshToken
    );
    if (!newRefreshToken) {
      return next(err("Refresh Token Error", 401));
    }

    const newAccessToken = await JwtAccessToken(account);
    if (!newAccessToken) {
      return next(err("Token Error", 401));
    }
    const setAccessTokenCookie = SetAccessTokenCookie(res, newAccessToken);

    const setRefreshTokenCookie = SetRefreshTokenCookie(res, newRefreshToken);

    const data = {
      email: account.email,
      role: role.name,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    return Response.Success(res, "Refresh Token", 0, 200, data);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.Logout = async (req, res, next) => {
  try {
    const ipAddress = req.ip;
    const xrefreshToken = req.headers["x-refresh-token"];
    if (!xrefreshToken) return next(err("Failed authorization", 401));

    const refreshToken = await RefreshTokens.findOne({
      token: xrefreshToken,
    });
    if (!refreshToken || !refreshToken.isActive) {
      return next(err("Invalid token", 401));
    }

    const revokeToken = await RevokeToken(ipAddress, refreshToken);
    if (!revokeToken) return next(err("Invalid revoke token", 401));
    return Response.Success(res, "Revoke token", 0, 200);
  } catch (error) {
    return next(err(error, 200));
  }
};

exports.ForgotPassword = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return next(err(error.details[0].message));
  }

  const body = value;
  try {
    const account = await Accounts.findOne({ email: body.email });
    if (!account) {
      return next(err("Account with this email does not exists.", 300));
    }
    const token = await JwtResetPasswordToken(account);
    if (!token) {
      return next(err("Token failed", 300));
    }
    const sendEmail = await sendForgotPassword("alpinnz@gmail.com", token);
    if (!sendEmail) {
      return next(err("Send token error", 300));
    }

    const update = await account.updateOne({ resetLink: token });
    if (!update) {
      return next(err("Reset password link error", 300));
    }
  } catch (error) {
    return next(err(error, 200));
  }
  return Response.Success(res, "Email has been sent, follow the intructions");
};

exports.ResetPassword = async (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
    repeat_password: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return next(err(error.details[0].message));
  }

  const body = value;
  try {
    const decode = await VerifyResetPasswordToken(body.token);
    if (!decode) return next(err("Invalid token"));
    const account = await Accounts.findOne({
      _id: ObjectId(decode.id),
      resetLink: body.token,
    });
    if (!account) return next(err("Failed account not found"));

    const hashPassword = await HashPassword(body.password);

    const update = await account.updateOne({
      resetLink: "",
      password: hashPassword,
    });
    if (!update) return next(err("Reset password error"));
    return Response.Success(res, "Reset password");
  } catch (error) {
    return next(err(error));
  }
};

exports.Activate = async (req, res) => {
  const {} = req.body;
  return Response.Success(res, "Activate");
};
