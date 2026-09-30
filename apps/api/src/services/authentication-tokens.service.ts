const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("node:crypto");
const PASSWORD_SALT_ROUNDS = 12;
type TokenAccount = { id: string };

const extractTokenAccountId = (account: TokenAccount): string => {
  return account.id;
};

const JwtAccessToken = async (user: TokenAccount) => {
  return jwt.sign(
    { id: extractTokenAccountId(user) },
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
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

const VerifyHashPassword = async (bodyPassword: string, password: string) => {
  return bcrypt.compare(bodyPassword, password);
};

const PasswordNeedsRehash = (passwordHash: string) =>
  bcrypt.getRounds(passwordHash) < PASSWORD_SALT_ROUNDS;

const VerifyAccessToken = async (accessToken: string) => {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
};

const VerifyRefreshToken = async (refreshToken: string) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
};

export = {
  JwtAccessToken,
  VerifyActivateToken,
  JwtResetPasswordToken,
  VerifyResetPasswordToken,
  JwtRefreshToken,
  HashPassword,
  VerifyHashPassword,
  PasswordNeedsRehash,
  VerifyAccessToken,
  VerifyRefreshToken,
};
