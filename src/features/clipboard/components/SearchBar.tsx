import { useRef, useCallback, useState, useEffect, type RefObject } from "react";
import { Search, X } from "lucide-react";
import { useClipboardStore } from "../store/clipboardStore";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { cn } from "../../../shared/lib/utils";

interface Props {
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function SearchBar({ inputRef }: Props) {
  const [localValue, setLocalValue] = useState("");
  const setFilter = useClipboardStore((s) => s.setFilter);
  const debouncedValue = useDebounce(localValue, 300);
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? internalRef;

  useEffect(() => {
    setFilter({ search: debouncedValue });
  }, [debouncedValue, setFilter]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    setFilter({ search: "" });
    ref.current?.focus();
  }, [setFilter, ref]);

  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
      />
      <input
        ref={ref as RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClear();
        }}
        placeholder="Search clipboard..."
        className={cn(
          "w-full pl-9 pr-8 py-2 text-sm rounded-lg outline-none transition-all",
          "bg-slate-100 dark:bg-slate-800",
          "text-slate-700 dark:text-slate-300",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500",
          "focus:bg-white dark:focus:bg-slate-900"
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}