const axios = require("axios").default;
const account = localStorage.getItem("account");

const config = {
  BASE_URL: "http://localhost:5000",
  PATH_API: "api/v1",
  X_API_KEY: "c4a783d532b9101af60f4745e29a954f",
  X_APP_KEY: "app-key",
};
if (account) {
  if (account.accessToken && account.refreshToken) {
    config["X_ACCESS_TOKEN"] = `${account.accessToken}`;
    config["X_REFRESH_TOKEN"] = `${account.refreshToken}`;
  }
}

const instance = axios.create({
  baseURL: config.BASE_URL,
});

instance.defaults.headers.common["x-refresh-token"] = config.X_REFRESH_TOKEN;
instance.defaults.headers.common["x-access-token"] = config.X_ACCESS_TOKEN;
instance.defaults.headers.common["x-api-key"] = config.X_API_KEY;
instance.defaults.headers.common["x-app-key"] = config.X_APP_KEY;

export default instance;
