const axios = require("axios").default;

const config = {
  BASE_URL: "http://localhost:5000",
  PATH_API: "api/v1",
  X_ACCESS_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWFkMjY1OGQyMmRkMjZhY2Y1YTIzYiIsImlhdCI6MTYwNTAzNzMzMywiZXhwIjoxNjkxNDM3MzMzfQ.JbHaudrUhMdW5G1WReLIM5Bqdv6Gx6OMO1llssdTyt4",
  X_REFRESH_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWFkMjY1OGQyMmRkMjZhY2Y1YTIzYiIsImlhdCI6MTYwNTAzNzMzMywiZXhwIjoyMjA5ODM3MzMzfQ.XF6RRDxYnUTYiL20yoKPfFPAwrRcZLN6dpJAa__9TWk",
  X_API_KEY: "c4a783d532b9101af60f4745e29a954f",
  X_APP_KEY: "app-key",
};

const instance = axios.create({
  baseURL: config.BASE_URL,
});

instance.defaults.headers.common["x-refresh-token"] = config.X_REFRESH_TOKEN;
instance.defaults.headers.common["x-access-token"] = config.X_ACCESS_TOKEN;
instance.defaults.headers.common["x-api-key"] = config.X_API_KEY;
instance.defaults.headers.common["x-app-key"] = config.X_APP_KEY;

export default instance;
