const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { RefreshTokens } = require("./../models");

exports.JwtAccessToken = async (account) => {
  return jwt.sign({ id: account._id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_TIMEOUT),
  });
};

exports.VerifyActivateToken = async (activateToken) => {
  return jwt.verify(activateToken, process.env.ACTIVATE_TOKEN_KEY);
};

exports.JwtResetPasswordToken = async (account) => {
  return jwt.sign({ id: account._id }, process.env.RESET_PASSWORD_TOKEN_KEY, {
    expiresIn: parseInt(process.env.RESET_PASSWORD_TOKEN_TIMEOUT),
  });
};

exports.VerifyResetPasswordToken = async (token) => {
  return jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_KEY);
};

const JwtRefreshToken = async (account) => {
  return jwt.sign({ id: account._id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_TIMEOUT),
  });
};

exports.HashPassword = async (password) => {
  return bcrypt.hashSync(password, 8);
};

exports.VerifyHashPassword = async (bodyPassword, password) => {
  return bcrypt.compareSync(bodyPassword, password);
};

exports.VerifyAccessToken = async (accessToken) => {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
};

exports.VerifyRefreshToken = async (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
};

exports.JwtRefreshTokenCreate = async (account, ipAddress) => {
  try {
    const token = await JwtRefreshToken(account);
    const newRefreshToken = {
      id_account: account.id,
      token: token,
      expires: new Date(
        Date.now() + parseInt(process.env.REFRESH_TOKEN_TIMEOUT)
      ),
      createdByIp: ipAddress,
    };
    const create = await RefreshTokens.create(newRefreshToken);
    if (!create) return null;
    return token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.JwtRefreshTokenReplaced = async (account, ipAddress, refreshToken) => {
  try {
    const token = await JwtRefreshToken(account);
    if (!token) return null;
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = token;
    const update = await RefreshTokens.findByIdAndUpdate(
      refreshToken._id,
      refreshToken
    );
    if (!update) return null;

    const newRefreshToken = {
      id_account: account.id,
      token: token,
      expires: new Date(
        Date.now() + parseInt(process.env.REFRESH_TOKEN_TIMEOUT)
      ),
      createdByIp: ipAddress,
    };
    const create = await RefreshTokens.create(newRefreshToken);
    if (!create) return null;
    return token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.RevokeToken = async (ipAddress, refreshToken) => {
  try {
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    const update = await RefreshTokens.findByIdAndUpdate(
      refreshToken._id,
      refreshToken
    );
    if (!update) return null;
    return update;
  } catch (err) {
    return null;
  }
};

exports.SetAccessTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + parseInt(process.env.ACCESS_TOKEN_TIMEOUT)),
  };
  res.cookie("x-refresh-token", token, cookieOptions);
};

exports.SetRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_TIMEOUT)),
  };
  res.cookie("x-action-token", token, cookieOptions);
};

exports.RemoveAccessTokenCookie = (res) => {
  res.clearCookie("x-refresh-token");
};

exports.RemoveRefreshTokenCookie = (res) => {
  res.clearCookie("x-action-token");
};
