# ثبت نام نماینده — React (JavaScript) + Formik + Yup + Tailwind

```bash
npm install
npm run dev
```

- `src/api.js` — all API calls (errors are read from `error_details.fa_details`)
- `src/schema.js` — Yup validation + initial values
- `src/SignupForm.jsx` — the form (Formik)
- `src/BranchSelect.jsx` — branch field with server-side search
- `src/ui.jsx`, `src/icons.jsx` — small presentational pieces
- `vite.config.js` — dev proxy `/backend` → `https://stage-api.sanaap.co` (avoids CORS).
  To call the API directly set `VITE_API_BASE_URL=https://stage-api.sanaap.co`.
- `first_name`, `last_name`, `phone_number` are required by the signup API but are not on this screen; defaults are in `src/api.js` (`VITE_FIRST_NAME`, `VITE_LAST_NAME`, `VITE_PHONE_NUMBER`).
