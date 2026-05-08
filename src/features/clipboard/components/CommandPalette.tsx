import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Search, Copy, Pin, Heart, BarChart2, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClipboardStore } from "../store/clipboardStore";
import { useClipboardHistory } from "../hooks/useClipboardHistory";
import { cn, truncate } from "../../../shared/lib/utils";
import { exportToJSON } from "../services/exportService";

interface Props {
  open: boolean;
  onClose: () => void;
  onToggleAnalytics: () => void;
}

export function CommandPalette({ open, onClose, onToggleAnalytics }: Props) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { filteredItems } = useClipboardHistory();
  const copyItem = useClipboardStore((s) => s.copyItem);
  const rawItems = useClipboardStore((s) => s.items);
  const allItems = useMemo(() => rawItems.filter((i) => !i.isDeleted), [rawItems]);

  const results = useMemo(
    () =>
      query.trim()
        ? filteredItems.filter((i) => i.content.toLowerCase().includes(query.toLowerCase()))
        : filteredItems.slice(0, 8),
    [query, filteredItems]
  );

  const allEntries = useMemo(
    () => [
      {
        type: "action" as const,
        id: "analytics",
        label: "Toggle Analytics",
        icon: BarChart2,
        run: () => { onToggleAnalytics(); onClose(); },
      },
      {
        type: "action" as const,
        id: "export",
        label: "Export to JSON",
        icon: Download,
        run: () => { exportToJSON(allItems); onClose(); },
      },
      ...results.map((item) => ({
        type: "item" as const,
        id: item.id,
        content: item.content,
        item,
      })),
    ],
    [results, allItems, onToggleAnalytics, onClose]
  );

  // Use a ref so the keyboard handler always sees the latest entries without
  // being a dep that re-registers the listener on every keystroke.
  const allEntriesRef = useRef(allEntries);
  allEntriesRef.current = allEntries;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  const handleSelect = useCallback(
    async (entry: (typeof allEntries)[number]) => {
      if (entry.type === "action") {
        entry.run();
      } else {
        await copyItem(entry.id);
        onClose();
      }
    },
    [copyItem, onClose]
  );
  const handleSelectRef = useRef(handleSelect);
  handleSelectRef.current = handleSelect;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, allEntriesRef.current.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const entry = allEntriesRef.current[selectedIndexRef.current];
        if (entry) void handleSelectRef.current(entry);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.96,    y: -12 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <Search size={18} className="text-slate-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or run a command..."
                  className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none text-sm"
                />
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {allEntries.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">No results</div>
                ) : (
                  allEntries.map((entry, idx) => (
                    <button
                      key={entry.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => void handleSelect(entry)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors",
                        idx === selectedIndex
                          ? "bg-indigo-600 text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      {entry.type === "action" ? (
                        <>
                          <entry.icon size={15} />
                          <span>{entry.label}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} className="shrink-0 opacity-60" />
                          <span className="font-mono text-xs truncate">{truncate(entry.content, 80)}</span>
                          {entry.type === "item" && entry.item.isFavorite && (
                            <Heart size={12} fill="currentColor" className="text-rose-400 shrink-0" />
                          )}
                          {entry.type === "item" && entry.item.isPinned && (
                            <Pin size={12} className="text-indigo-400 shrink-0" />
                          )}
                        </>
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 flex gap-3 text-xs text-slate-400">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">Esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}