import {
  Layers, Link, Mail, KeyRound, Code2, Phone, FileText,
  Heart, BarChart2, Download, Upload
} from "lucide-react";
import { useClipboardStore } from "../store/clipboardStore";
import type { ClipboardCategory } from "../types/clipboard.types";
import { cn } from "../../../shared/lib/utils";
import { exportToJSON, exportToTXT, importFromJSON } from "../services/exportService";
import { useRef, useMemo } from "react";

type CategoryEntry = {
  value: ClipboardCategory | "all";
  label: string;
  Icon: React.ElementType;
  shortcut: string;
};

const CATEGORIES: CategoryEntry[] = [
  { value: "all",   label: "All",   Icon: Layers,   shortcut: "⌃1" },
  { value: "link",  label: "Links", Icon: Link,     shortcut: "⌃2" },
  { value: "email", label: "Emails",Icon: Mail,     shortcut: "⌃3" },
  { value: "otp",   label: "OTPs",  Icon: KeyRound, shortcut: "⌃4" },
  { value: "code",  label: "Code",  Icon: Code2,    shortcut: "⌃5" },
  { value: "phone", label: "Phone", Icon: Phone,    shortcut: "⌃6" },
  { value: "text",  label: "Text",  Icon: FileText, shortcut: "⌃7" },
];

interface Props {
  onToggleAnalytics: () => void;
  analyticsOpen: boolean;
}

export function CategoryFilter({ onToggleAnalytics, analyticsOpen }: Props) {
  const rawItems = useClipboardStore((s) => s.items);
  const items = useMemo(() => rawItems.filter((i) => !i.isDeleted), [rawItems]);
  const filter = useClipboardStore((s) => s.filter);
  const setFilter = useClipboardStore((s) => s.setFilter);
  const addItem = useClipboardStore((s) => s.addItem);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const countFor = (cat: ClipboardCategory | "all") =>
    cat === "all" ? items.length : items.filter((i) => i.category === cat).length;

  return (
    <aside className="flex flex-col gap-1 w-52 shrink-0 h-full overflow-y-auto pb-4">
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1 mt-1">
        Categories
      </p>

      {CATEGORIES.map(({ value, label, Icon, shortcut }) => {
        const active = filter.category === value;
        const count = countFor(value);
        return (
          <button
            key={value}
            onClick={() => setFilter({ category: value })}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left group",
              active
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Icon size={15} />
            <span className="flex-1">{label}</span>
            <span className={cn(
              "text-xs tabular-nums",
              active ? "text-indigo-200" : "text-slate-400 dark:text-slate-600"
            )}>
              {count}
            </span>
            <span className={cn(
              "text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono",
              active ? "text-indigo-200" : "text-slate-400"
            )}>
              {shortcut}
            </span>
          </button>
        );
      })}

      <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

      <button
        onClick={() => setFilter({ showFavoritesOnly: !filter.showFavoritesOnly })}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
          filter.showFavoritesOnly
            ? "bg-rose-600 text-white"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <Heart size={15} fill={filter.showFavoritesOnly ? "white" : "none"} />
        <span>Favorites</span>
      </button>

      <button
        onClick={onToggleAnalytics}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
          analyticsOpen
            ? "bg-slate-700 text-white dark:bg-slate-600"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <BarChart2 size={15} />
        <span>Analytics</span>
        <span className="text-xs text-slate-400 ml-auto font-mono">⌃⇧A</span>
      </button>

      <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

      <button
        onClick={() => exportToJSON(items)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Download size={15} />
        <span>Export JSON</span>
      </button>
      <button
        onClick={() => exportToTXT(items)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Download size={15} />
        <span>Export TXT</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const imported = await importFromJSON(file);
            imported.forEach((it) => addItem(it.content));
          } catch {
            alert("Failed to import: invalid file format.");
          }
          e.target.value = "";
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Upload size={15} />
        <span>Import JSON</span>
      </button>
    </aside>
  );
}