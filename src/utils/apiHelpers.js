/**
 * تبدیل پاسخ‌های مختلف API به فرمت استاندارد options
 * API های list ممکن است فرمت‌های مختلفی داشته باشند:
 * [...] | { results: [...] } | { response: [...] } | { response: { results: [...] } } | { data: [...] }
 * 
 * @param {any} data - پاسخ API
 * @returns {Array<{id: string, name: string}>} - آرایه استاندارد options
 */
export const normalizeListResponse = (data) => {
  const list =
    (Array.isArray(data) ? data : null) ??
    data?.results ??
    data?.response?.results ??
    data?.response ??
    data?.data ??
    [];

  return (Array.isArray(list) ? list : []).map((item) => ({
    id: String(item.id ?? item.pk ?? item.value),
    name: item.name ?? item.title ?? item.label,
  }));
};

/**
 * خطای عمومی برای زمانی که API پاسخ مشخصی نمی‌دهد
 */
export const GENERIC_ERROR = "خطایی رخ داد. لطفا دوباره تلاش کنید.";

/**
 * استخراج پیام خطا از پاسخ سرور
 * @param {any} data - پاسخ API
 * @returns {string|null} - پیام خطا یا null
 */
export const extractErrorMessage = (data) => {
  const details = data?.error_details;
  return typeof details === "string" ? details : details?.fa_details;
};
