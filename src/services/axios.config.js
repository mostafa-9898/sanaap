import axios from "axios";
import { GENERIC_ERROR, extractErrorMessage } from "../utils";

/**
 * آدرس پایه API
 * درخواست‌ها به "/backend/..." ارسال می‌شوند که Vite آن را به
 * https://stage-api.sanaap.co پروکسی می‌کند
 * (برای فراخوانی مستقیم API، VITE_API_BASE_URL را تنظیم کنید)
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "/backend";

/**
 * ایجاد instance اصلی axios با تنظیمات پیش‌فرض
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 ثانیه timeout
});

/**
 * Interceptor برای log کردن درخواست‌ها (debug)
 */
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor برای پردازش پاسخ‌ها
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // بررسی موفقیت‌آمیز بودن پاسخ بر اساس is_success
    const data = response.data;
    if (data?.is_success === false) {
      const message = extractErrorMessage(data);
      const error = new Error(message || data?.message || GENERIC_ERROR);
      error.fromServer = Boolean(message);
      throw error;
    }
    return response;
  },
  (error) => {
    // خطاهای شبکه یا timeout
    if (axios.isCancel(error)) {
      throw error; // درخواست لغو شده
    }

    if (!error.response) {
      // خطای شبکه (عدم اتصال به سرور)
      throw new Error("ارتباط با سرور برقرار نشد");
    }

    // خطاهای HTTP (4xx, 5xx)
    const data = error.response.data;
    console.error("API error:", error.config.url, error.response.status, data);

    const message = extractErrorMessage(data);
    const apiError = new Error(message || data?.message || GENERIC_ERROR);
    apiError.fromServer = Boolean(message);
    throw apiError;
  }
);

/**
 * تابع کمکی برای درخواست‌های HTTP
 * @param {string} path - مسیر endpoint
 * @param {object} options - تنظیمات درخواست
 * @returns {Promise<any>} - داده پاسخ
 */
export async function request(path, { method = "GET", params, body, signal } = {}) {
  const response = await axiosInstance.request({
    url: path,
    method,
    params,
    data: body,
    signal,
  });

  return response.data;
}

export default axiosInstance;
