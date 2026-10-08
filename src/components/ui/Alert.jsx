import { WarnIcon } from "../../shared/icons";

/**
 * کامپوننت Alert برای نمایش پیام‌های هشدار
 */
export function Alert({ children }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-3 text-sm font-medium text-gray-800"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-400 text-white">
        <WarnIcon className="size-5" />
      </span>
      <span>{children}</span>
    </div>
  );
}
