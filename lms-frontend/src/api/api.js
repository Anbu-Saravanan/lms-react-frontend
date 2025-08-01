import axios from "axios";


const api = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: process.env.REACT_APP_BACKEND_URL,

});

// Attach Authorization Bearer token if available
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    console.log(
      "API Request:",
      config.url,
      "Token:",
      accessToken,
      "Headers before:",
      config.headers
    );


    // Attach token only if not calling /api/auth/*
    if (
      accessToken &&
      !config.url.includes("/api/auth/") // You can adjust as needed
    ) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token logic on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await api.post("/api/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken", res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
        originalRequest.headers["Authorization"] = `Bearer ${res.data.jwt}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
