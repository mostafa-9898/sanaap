import axiosInstance from "./axios.config";
import { normalizeListResponse } from "../utils";

/**
 * دریافت لیست استان‌ها
 * @param {AbortSignal} signal - سیگنال لغو درخواست
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const getProvinces = async (signal) => {
  const response = await axiosInstance.get("base/provinces_wop/", { signal });
  return normalizeListResponse(response.data);
};

/**
 * دریافت لیست شهرستان‌های یک استان
 * @param {string} province - شناسه استان
 * @param {AbortSignal} signal - سیگنال لغو درخواست
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const getCounties = async (province, signal) => {
  const response = await axiosInstance.get("base/counties_wop/", {
    params: { province },
    signal,
  });
  return normalizeListResponse(response.data);
};
