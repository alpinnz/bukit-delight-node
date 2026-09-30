type ApiConfig = {
  baseUrl: string;
  apiPath: string;
  apiKey: string;
  appKey: string;
};

const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || "/",
  apiPath: "api/v1",
  apiKey: "",
  appKey: "",
};

export default apiConfig;
