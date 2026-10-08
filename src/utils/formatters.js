/**
 * تبدیل اعداد فارسی و عربی به انگلیسی و حذف کاراکترهای غیر عددی
 * @param {string} value - مقدار ورودی
 * @param {number} max - حداکثر طول مجاز
 * @returns {string} - رشته عددی انگلیسی
 */
export const normalizeDigits = (value, max = 20) =>
  value
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/\D/g, "")
    .slice(0, max);

/**
 * فرمت کردن شماره تلفن با خط تیره
 * @param {string} digits - رشته عددی
 * @returns {string} - شماره فرمت شده (مثل: 1234 - 5678)
 */
export const formatPhone = (digits) =>
  digits.length > 4 ? `${digits.slice(0, 4)} - ${digits.slice(4)}` : digits;
