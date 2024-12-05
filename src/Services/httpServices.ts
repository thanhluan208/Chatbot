import { LOCAL_STORAGE_KEY } from "@/Constants/common";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import userService from "./user.service";

export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "user";

class Services {
  axios: AxiosInstance;
  isRefreshing = false;
  requestQueue: ((token: string) => void)[] = [];

  constructor() {
    this.axios = axios;
    this.axios.defaults.withCredentials = false;
    
    const access_token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    this.axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

    //! Interceptor request
    this.axios.interceptors.request.use(
      function (config) {
        config.headers["x-timezone"] =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        config.headers["ngrok-skip-browser-warning"] = "69420"; // This is a temporary solution to bypass the ngrok warning. For more information, please visit https://ngrok.com/docs#http-headers. The value of

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    //! Interceptor response
    this.axios.interceptors.response.use(
      function (response: AxiosResponse) {
        // Pass through successful responses
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config; // Access the original request
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_KEY.REFRESH_TOKEN
        );

        if (error.response?.status === 401 && refreshToken) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              // Refresh the token
              const userData = JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_KEY.USER_DATA) || "{}"
              );
              this.attachTokenToHeader(refreshToken);
              const response = await userService.refreshToken(userData?.email);
              const newAccessToken = response?.data?.access_token;

              // Update the local storage with the new token
              console.log("newAccessToken,", newAccessToken);
              if (newAccessToken) {
                localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccessToken);
              }

              this.attachTokenToHeader(newAccessToken);

              // Resolve all queued requests with the new token
              this.requestQueue.forEach((cb) => {
                console.log("retrying...");
                cb(newAccessToken);
              });
              this.requestQueue = []; // Clear the queue

              this.isRefreshing = false;
              if (originalRequest?.headers) {
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return this.axios.request(originalRequest);
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              this.isRefreshing = false;

              // Redirect to login or handle appropriately
              window.location.reload();
              return Promise.reject(refreshError);
            }
          }

          // Queue the current request until the token refresh is complete
          return new Promise((resolve) => {
            this.requestQueue.push((newToken: string) => {
              console.log(newToken);
              if (originalRequest?.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              }
              originalRequest && resolve(this.axios(originalRequest));
            });
          });
        }

        return Promise.reject(error); // Reject all other errors
      }
    );
  }

  attachTokenToHeader(token: string) {
    this.axios.defaults.headers.Authorization = `Bearer ${token}`;
  }

  setupInterceptors() {
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error?.response || {};
        if (status === 200) {
          window.localStorage.clear();
          window.location.reload();
        }

        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config);
  }

  post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config);
  }

  patch(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.patch(url, data, config);
  }
}

export default new Services();
