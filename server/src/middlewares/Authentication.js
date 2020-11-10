const jwt = require("jsonwebtoken");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 403;
  return error;
};

exports.checkAccessToken = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey != process.env.API_KEY) {
    return next(err("No api provided.", 403));
  }

  const appKey = req.headers["x-app-key"];
  if (appKey != process.env.APP_KEY) {
    return next(err("No app provided.", 403));
  }

  if (req.headers["x-access-token"]) {
    jwt.verify(
      req.headers["x-access-token"],
      process.env.ACCESS_TOKEN_KEY,
      (err, decoded) => {
        if (err) {
          return next(err("Unauthorized access", 401));
        }
        req.decoded = decoded;
        return next();
      }
    );
  } else {
    return next(err("not access", 403));
  }
};
