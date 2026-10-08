import { useEffect, useState } from "react";
import { searchBranches } from "../../services";
import { controlBase, controlBorder } from "../../utils";
import { SearchIcon, Spinner } from "../../shared/icons";

// Searchable branch field: every time the user types, the text is sent to the
// backend (name=...) and the returned branches are listed.
// The parent uses key={province}, so this component resets when the province changes.
export default function BranchSelect({ id, province, onSelect, onBlur, error }) {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState(false); // true after choosing an item
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open || !province || picked) return;
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(
      () => {
        searchBranches(province, text.trim(), controller.signal)
          .then((list) => {
            setItems(list);
            setFailed(false);
            setLoading(false);
          })
          .catch((e) => {
            if (e.name === "AbortError") return;
            setItems([]);
            setFailed(true);
            setLoading(false);
          });
      },
      text ? 400 : 0, // small debounce while typing
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, province, text, picked]);

  const pick = (branch) => {
    setText(branch.name);
    setPicked(true);
    setOpen(false);
    onSelect(branch.id);
  };

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type="text"
        autoComplete="off"
        disabled={!province}
        placeholder="شعبه بیمه را جستجو و انتخاب کنید."
        value={text}
        aria-invalid={!!error}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          onBlur();
        }}
        onChange={(e) => {
          setText(e.target.value);
          setPicked(false);
          setOpen(true);
          onSelect(""); // typing again clears the selected branch
        }}
        className={`${controlBase} ${controlBorder(error)} pe-11`}
      />
      <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-gray-500">
        {loading ? <Spinner className="size-4" /> : <SearchIcon className="size-5" />}
      </span>

      {open && !picked && province && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {loading && items.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">در حال جستجو...</li>
          ) : failed ? (
            <li className="px-4 py-3 text-sm text-red-600">دریافت لیست شعبه‌ها با خطا مواجه شد.</li>
          ) : items.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">شعبه‌ای یافت نشد.</li>
          ) : (
            items.map((o) => (
              <li
                key={o.id}
                role="option"
                // onMouseDown fires before the input's onBlur closes the list
                onMouseDown={() => pick(o)}
                className="cursor-pointer px-4 py-2.5 text-sm hover:bg-brand/10 hover:text-brand-dark"
              >
                {o.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
