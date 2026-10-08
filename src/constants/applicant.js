/**
 * اطلاعات پیش‌فرض متقاضی
 * این مقادیر توسط endpoint ثبت نام نیاز هستند اما جزو این صفحه نیستند
 * (متعلق به مرحله قبلی پروژه هستند)
 */
export const APPLICANT = {
  first_name: import.meta.env.VITE_FIRST_NAME || "نماینده",
  last_name: import.meta.env.VITE_LAST_NAME || "آزمایشی",
  phone_number: import.meta.env.VITE_PHONE_NUMBER || "09000000009",
};

/**
 * شرکت بیمه ثابت برای این پروژه
 */
export const INSURANCE_COMPANY = "DEY";
