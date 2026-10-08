import axiosInstance from "./axios.config";
import { APPLICANT } from "../constants";

/**
 * بررسی در دسترس بودن کد نمایندگی
 * موفق می‌شود اگر کد آزاد باشد، خطا می‌دهد اگر استفاده شده باشد
 * 
 * @param {string} agent_code - کد نمایندگی
 * @param {AbortSignal} signal - سیگنال لغو درخواست
 * @returns {Promise<any>}
 */
export const checkAgencyCode = async (agent_code, signal) => {
  const response = await axiosInstance.post(
    "api/v2/app/DEY/agent/verification/signup/check_agency_code/",
    { agent_code },
    { signal }
  );
  return response.data;
};

/**
 * ثبت نام نماینده جدید
 * @param {object} values - اطلاعات فرم
 * @returns {Promise<{access: string, refresh: string}>} - توکن‌های دسترسی
 */
export const signup = async (values) => {
  const body = {
    ...APPLICANT,
    agent_code: values.agentCode.trim(),
    province: values.province,
    county: values.county,
    address: values.address.trim(),
    insurance_branch: values.branch,
    city_code: values.cityCode,
    phone: values.phone,
    agency_type: values.agencyType, // "real" | "legal"
  };

  // نام نمایندگی فقط برای نمایندگی‌های حقوقی
  if (values.agencyType === "legal") {
    body.Name = values.agencyName.trim();
  }

  const response = await axiosInstance.post(
    "api/v2/app/DEY/agent/verification/signup/",
    body
  );

  return response.data.response; // token is in response.access
};
