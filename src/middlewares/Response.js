const Response = (name, message, code, status, data) => {
  return {
    name: `${name}`,
    message: `${message}`,
    code: code,
    status: status,
    data: data,
  };
};

exports.Success = async (res, message, code = 0, status = 200, data) => {
  const json = Response("Success", `${message} success`, code, status, data);
  return res.status(200).json(json);
};

exports.Error = async (err, req, res, next) => {
  const json = Response(
    "Error",
    err.message || "Internal Server Error",
    err.code || 0,
    err.status || 500
  );
  return res.status(err.status || 500).json(json);
};
