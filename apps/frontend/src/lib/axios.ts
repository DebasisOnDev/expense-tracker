/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import constant from "@/constant";
import Cookie from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_APP_API_URL || "http://localhost:3001",
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const accessToken = Cookie.get(constant.ACCESS_TOKEN_KEY);
  if (accessToken) {
    if (config.url !== "/api/auth/refresh") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest.url === "/api/auth/login" ||
      originalRequest.url === "/api/auth/refresh" ||
      originalRequest._retry
    ) {
      if (
        error.response?.status === 401 &&
        originalRequest.url === "/api/auth/refresh"
      ) {
        console.error("Refresh token invalid or expired. Logging out.");
        Cookie.remove(constant.ACCESS_TOKEN_KEY);
        Cookie.remove(constant.REFRESH_TOKEN_KEY);

        window.location.href = "/login?sessionExpired=true";
      }

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = "Bearer " + token;
          }
          originalRequest._retry = true;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = Cookie.get(constant.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        console.error("No refresh token available for refresh attempt.");
        throw new Error("Refresh token not found");
      }

      console.log("Attempting token refresh...");
      const { data } = await api.post("/api/auth/refresh", { refreshToken });
      const newAccessToken = data.accessToken;

      Cookie.set(constant.ACCESS_TOKEN_KEY, newAccessToken, {
        expires: constant.ACCESS_TOKEN_EXPIRE,
      });
      console.log("Token refreshed successfully.");

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshTokenError: any) {
      console.error("Token refresh failed:", refreshTokenError);

      processQueue(
        refreshTokenError instanceof AxiosError
          ? refreshTokenError
          : new AxiosError(refreshTokenError.message),
        null
      );

      Cookie.remove(constant.ACCESS_TOKEN_KEY);
      Cookie.remove(constant.REFRESH_TOKEN_KEY);
      window.location.href = "/login?sessionExpired=true";

      return Promise.reject(refreshTokenError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
