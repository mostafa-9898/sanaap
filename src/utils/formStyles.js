/**
 * کلاس‌های پایه برای کنترل‌های فرم
 */
export const controlBase =
  "block w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition " +
  "placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand " +
  "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-200/70";

/**
 * کلاس‌های border بر اساس وضعیت error
 * @param {boolean|string} error - وضعیت خطا
 * @returns {string} - کلاس CSS
 */
export const controlBorder = (error) =>
  error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-line";
