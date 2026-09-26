const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("node:crypto");
type TokenAccount = { id: string };

const extractTokenAccountId = (account: TokenAccount): string => {
  return account.id;
};

const JwtAccessToken = async (account: TokenAccount) => {
  return jwt.sign(
    { id: extractTokenAccountId(account), type: "staff" },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_TIMEOUT!),
      algorithm: "HS256",
    },
  );
};

const JwtCustomerToken = async (customer: TokenAccount) => {
  return jwt.sign(
    { id: extractTokenAccountId(customer), type: "customer" },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_TIMEOUT!),
      algorithm: "HS256",
    },
  );
};

const VerifyActivateToken = async (activateToken: string) => {
  return jwt.verify(activateToken, process.env.ACTIVATE_TOKEN_KEY);
};

const JwtResetPasswordToken = async (account: TokenAccount) => {
  return jwt.sign(
    { id: extractTokenAccountId(account) },
    process.env.RESET_PASSWORD_TOKEN_KEY,
    { expiresIn: parseInt(process.env.RESET_PASSWORD_TOKEN_TIMEOUT!) },
  );
};

const VerifyResetPasswordToken = async (token: string) => {
  return jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_KEY);
};

const JwtRefreshToken = async (account: TokenAccount) => {
  return jwt.sign(
    {
      id: extractTokenAccountId(account),
      jti: randomBytes(16).toString("hex"),
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: parseInt(process.env.REFRESH_TOKEN_TIMEOUT!) },
  );
};

const HashPassword = async (password: string) => {
  return bcrypt.hashSync(password, 8);
};

const VerifyHashPassword = async (bodyPassword: string, password: string) => {
  return bcrypt.compareSync(bodyPassword, password);
};

const VerifyAccessToken = async (accessToken: string) => {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
};

const VerifyRefreshToken = async (refreshToken: string) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
};

export = {
  JwtAccessToken,
  JwtCustomerToken,
  VerifyActivateToken,
  JwtResetPasswordToken,
  VerifyResetPasswordToken,
  JwtRefreshToken,
  HashPassword,
  VerifyHashPassword,
  VerifyAccessToken,
  VerifyRefreshToken,
};
