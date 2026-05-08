import { ChevronDown } from "lucide-react";
import { useClipboardStore } from "../store/clipboardStore";
import type { SortOption } from "../types/clipboard.types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",      label: "Newest" },
  { value: "oldest",      label: "Oldest" },
  { value: "mostUsed",    label: "Most Used" },
  { value: "alphabetical",label: "A–Z" },
];

export function SortControl() {
  const sortBy = useClipboardStore((s) => s.filter.sortBy);
  const setFilter = useClipboardStore((s) => s.setFilter);

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500 dark:text-slate-400">Sort:</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setFilter({ sortBy: e.target.value as SortOption })}
          className="text-xs pl-2 pr-6 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 outline-none cursor-pointer appearance-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}