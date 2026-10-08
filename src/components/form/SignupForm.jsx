import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { checkAgencyCode, getCounties, getProvinces, signup } from "../../services";
import { initialValues, signupSchema } from "../../validation";
import { normalizeDigits, formatPhone, controlBase, controlBorder } from "../../utils";
import { CheckCircle, ClearIcon, Spinner } from "../../shared/icons";
import { Alert, Field, Select } from "../ui";
import BranchSelect from "./BranchSelect";

export default function SignupForm() {
  const [provinces, setProvinces] = useState([]);
  const [counties, setCounties] = useState([]);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [error, setError] = useState(""); // load / submit errors
  const [done, setDone] = useState(false);

  // agent code check: idle | checking | available | taken | error
  const [codeStatus, setCodeStatus] = useState("idle");
  const [codeMessage, setCodeMessage] = useState("");

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: handleSubmit,
  });
  const { values, setFieldValue, setValues, setFieldTouched } = formik;

  // show an error only after the field was touched (or the form was submitted)
  const err = (name) => formik.touched[name] && formik.errors[name];

  /* 1) provinces: loaded once */
  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch((e) => setError(e.message));
  }, []);

  /* 2) counties: loaded again whenever the province changes */
  useEffect(() => {
    setCounties([]);
    if (!values.province) return;
    let ignore = false;
    setCountiesLoading(true);
    getCounties(values.province)
      .then((list) => !ignore && setCounties(list))
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setCountiesLoading(false));
    return () => {
      ignore = true;
    };
  }, [values.province]);

  /* 3) agent code: checked 0.5s after the user stops typing */
  const code = values.agentCode.trim();
  useEffect(() => {
    if (!code) {
      setCodeStatus("idle");
      return;
    }
    setCodeStatus("checking");
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        await checkAgencyCode(code);
        if (!ignore) setCodeStatus("available");
      } catch (e) {
        if (ignore) return;
        // "taken" only when the server itself rejected the code;
        // a network/other failure must not block the user
        setCodeStatus(e.fromServer ? "taken" : "error");
        setCodeMessage(e.message);
      }
    }, 500);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [code]);

  /* 4) submit (only runs when Yup validation passed) */
  async function handleSubmit(values) {
    setError("");

    // make sure the code was verified, even if the user submitted very quickly
    if (codeStatus !== "available") {
      try {
        await checkAgencyCode(values.agentCode.trim());
      } catch (e) {
        if (e.fromServer) {
          setCodeStatus("taken");
          setCodeMessage(e.message);
          return;
        }
      }
    }

    try {
      const tokens = await signup(values);
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh ?? "");
      setDone(true);
    } catch (e) {
      setError(e.message);
    }
  }

  // changing the province resets the fields that depend on it
  const changeProvince = (province) =>
    setValues({ ...values, province, county: "", branch: "" });

  // "real" has no agency-name field, so its value is cleared
  const changeAgencyType = (agencyType) =>
    setValues({
      ...values,
      agencyType,
      agencyName: agencyType === "real" ? "" : values.agencyName,
    });

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-md">
        <CheckCircle className="mx-auto size-14 text-emerald-500" />
        <h1 className="mt-4 text-lg font-bold">ثبت نام با موفقیت انجام شد</h1>
        <p className="mt-2 text-sm text-gray-500">اطلاعات نماینده با موفقیت ثبت شد.</p>
      </div>
    );
  }

  const banner = codeStatus === "taken" ? codeMessage : error;

  return (
    <div className="space-y-3">
      {banner && <Alert>{banner}</Alert>}

      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl bg-white p-5 shadow-md"
      >
        {/* agent code */}
        <Field id="agentCode" label="کد نمایندگی" error={err("agentCode")}>
          <div className="relative">
            <input
              id="agentCode"
              name="agentCode"
              inputMode="numeric"
              autoComplete="off"
              placeholder="کد نمایندگی را وارد کنید."
              value={values.agentCode}
              onChange={(e) => setFieldValue("agentCode", normalizeDigits(e.target.value))}
              onBlur={formik.handleBlur}
              aria-invalid={!!err("agentCode") || codeStatus === "taken"}
              className={`${controlBase} ${controlBorder(
                err("agentCode") || codeStatus === "taken",
              )} pe-20`}
            />
            <span className="absolute inset-y-0 inset-e-3 flex items-center gap-2">
              {values.agentCode && (
                <button
                  type="button"
                  aria-label="پاک کردن"
                  onClick={() => setFieldValue("agentCode", "")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ClearIcon className="size-6" />
                </button>
              )}
              {codeStatus === "checking" && <Spinner className="size-5 text-brand" />}
              {codeStatus === "available" && <CheckCircle className="size-5 text-emerald-500" />}
            </span>
          </div>
        </Field>

        {/* province */}
        <Field id="province" label="استان" error={err("province")}>
          <Select
            id="province"
            value={values.province}
            options={provinces}
            loading={provinces.length === 0 && !error}
            placeholder="استان را انتخاب کنید."
            error={err("province")}
            onChange={changeProvince}
            onBlur={() => setFieldTouched("province")}
          />
        </Field>

        {/* county: disabled until a province is chosen */}
        <Field id="county" label="شهر" error={err("county")}>
          <Select
            id="county"
            value={values.county}
            options={counties}
            loading={countiesLoading}
            disabled={!values.province}
            placeholder="شهر را انتخاب کنید."
            error={err("county")}
            onChange={(v) => setFieldValue("county", v)}
            onBlur={() => setFieldTouched("county")}
          />
        </Field>

        {/* address */}
        <Field id="address" label="آدرس" error={err("address")}>
          <textarea
            id="address"
            rows={4}
            placeholder="آدرس را وارد کنید."
            {...formik.getFieldProps("address")}
            aria-invalid={!!err("address")}
            className={`${controlBase} ${controlBorder(err("address"))} resize-none`}
          />
        </Field>

        {/* insurance branch: depends on province, searched on the server */}
        <Field id="branch" label="شعبه بیمه" error={err("branch")}>
          <BranchSelect
            key={values.province}
            id="branch"
            province={values.province}
            onSelect={(id) => setFieldValue("branch", id)}
            onBlur={() => setFieldTouched("branch")}
            error={err("branch")}
          />
        </Field>

        {/* landline: [phone | city code] */}
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-bold text-gray-800">
            تلفن ثابت
          </label>
          <div className="flex gap-3" dir="rtl">
            <input
              id="phone"
              name="phone"
              dir="ltr"
              inputMode="numeric"
              placeholder="XXXX - XXXX"
              value={formatPhone(values.phone)}
              onChange={(e) => setFieldValue("phone", normalizeDigits(e.target.value, 8))}
              onBlur={formik.handleBlur}
              aria-label="تلفن ثابت"
              aria-invalid={!!err("phone")}
              className={`${controlBase} ${controlBorder(err("phone"))} min-w-0 flex-1 tracking-wider`}
            />
            <input
              id="cityCode"
              name="cityCode"
              dir="ltr"
              inputMode="numeric"
              placeholder="021"
              value={values.cityCode}
              onChange={(e) => setFieldValue("cityCode", normalizeDigits(e.target.value, 4))}
              onBlur={formik.handleBlur}
              aria-label="کد شهر"
              aria-invalid={!!err("cityCode")}
              className={`${controlBase} ${controlBorder(err("cityCode"))} w-24! shrink-0 text-center`}
            />
          </div>
          {(err("phone") || err("cityCode")) && (
            <p role="alert" className="mt-1.5 text-xs text-red-600">
              {err("cityCode") || err("phone")}
            </p>
          )}
        </div>

        {/* agency type */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-gray-800">نوع نمایندگی:</legend>
          <div className="flex items-center gap-8">
            {[
              ["real", "حقیقی"],
              ["legal", "حقوقی"],
            ].map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="agencyType"
                  value={value}
                  checked={values.agencyType === value}
                  onChange={() => changeAgencyType(value)}
                  className="size-5 accent-accent"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* agency name: only for legal agencies */}
        {values.agencyType === "legal" && (
          <Field id="agencyName" label="نام نمایندگی" error={err("agencyName")}>
            <input
              id="agencyName"
              placeholder="نام نمایندگی را وارد کنید."
              {...formik.getFieldProps("agencyName")}
              aria-invalid={!!err("agencyName")}
              className={`${controlBase} ${controlBorder(err("agencyName"))}`}
            />
          </Field>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
        >
          {formik.isSubmitting && <Spinner className="size-5" />}
          ثبت نام
        </button>
      </form>
    </div>
  );
}
