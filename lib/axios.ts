import { useUserStore } from "@/stores/userStore";
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

type ApiClient = {
  get: <T = any>(url: string, config?: any) => Promise<T>;
  post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
  put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
  delete: <T = any>(url: string, config?: any) => Promise<T>;
  request: <T = any>(config: any) => Promise<T>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const handleRefreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/refresh-token`, {
      withCredentials: true,
    });
    const data = response?.data?.data;
    if (data) {
      localStorage.setItem("access_token", data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] = token
      ? `Bearer ${token}`
      : "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error?.config as any;
    const { logout } = useUserStore.getState();

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      localStorage.removeItem("access_token");
      logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await handleRefreshToken();
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return instance(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      error.response?.status === 400 &&
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      localStorage.removeItem("access_token");
      logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error?.response?.data ?? error);
  }
);

export default instance as unknown as ApiClient;
