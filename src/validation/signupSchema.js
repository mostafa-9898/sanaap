import * as Yup from "yup";

/**
 * مقادیر اولیه فرم ثبت نام نماینده
 */
export const initialValues = {
  agentCode: "",
  province: "",
  county: "",
  address: "",
  branch: "", // id of the selected insurance branch
  cityCode: "",
  phone: "",
  agencyType: "real",
  agencyName: "",
};

/**
 * اسکیمای اعتبارسنجی فرم ثبت نام با Yup
 */
export const signupSchema = Yup.object({
  agentCode: Yup.string().trim().required("کد نمایندگی را وارد کنید."),
  province: Yup.string().required("استان را انتخاب کنید."),
  county: Yup.string().required("شهر را انتخاب کنید."),
  address: Yup.string().trim().required("آدرس را وارد کنید."),
  branch: Yup.string().required("شعبه بیمه را انتخاب کنید."),
  cityCode: Yup.string()
    .required("کد شهر را وارد کنید.")
    .matches(/^0\d{2,3}$/, "کد شهر باید با صفر شروع شود (مثلا 021)."),
  phone: Yup.string()
    .required("تلفن ثابت را وارد کنید.")
    .matches(/^\d{8}$/, "تلفن ثابت باید ۸ رقم باشد."),
  agencyType: Yup.string().oneOf(["real", "legal"]),
  // نام نمایندگی فقط برای نمایندگی‌های حقوقی الزامی است
  agencyName: Yup.string().when("agencyType", {
    is: "legal",
    then: (s) => s.trim().required("نام نمایندگی را وارد کنید."),
  }),
});
