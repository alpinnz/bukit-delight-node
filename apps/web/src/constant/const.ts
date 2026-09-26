type WebConstants = {
  BASE_URL: string;
  PATH_API: string;
  X_API_KEY: string;
  X_APP_KEY: string;
};

const Const: WebConstants = {
  BASE_URL: import.meta.env.VITE_API_URL || "",
  PATH_API: "api/v1",
  X_API_KEY: "",
  X_APP_KEY: "",
};

export default Const;
