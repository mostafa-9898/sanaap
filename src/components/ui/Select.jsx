import { ChevronDown, Spinner } from "../../shared/icons";
import { controlBase, controlBorder } from "../../utils";

/**
 * کامپوننت Select - انتخابگر native با استایل سفارشی
 */
export function Select({ id, value, options, placeholder, loading, disabled, error, onChange, onBlur }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`${controlBase} ${controlBorder(error)} appearance-none pe-11 ${
          value ? "" : "text-gray-400"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id} className="text-gray-800">
            {o.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-gray-500">
        {loading ? <Spinner className="size-4" /> : <ChevronDown className="size-5" />}
      </span>
    </div>
  );
}
