import { useState, useRef, useCallback, lazy, Suspense, useMemo } from "react";
import { Keyboard } from "lucide-react";
import { useClipboard } from "../features/clipboard/hooks/useClipboard";
import { useKeyboardShortcuts } from "../features/clipboard/hooks/useKeyboardShortcuts";
import { ClipboardList } from "../features/clipboard/components/ClipboardList";
import { CategoryFilter } from "../features/clipboard/components/CategoryFilter";
import { SearchBar } from "../features/clipboard/components/SearchBar";
import { PinnedItems } from "../features/clipboard/components/PinnedItems";
import { SortControl } from "../features/clipboard/components/SortControl";
import { CommandPalette } from "../features/clipboard/components/CommandPalette";
import { PermissionBanner } from "../features/clipboard/components/PermissionBanner";
import { ManualInputFAB } from "../features/clipboard/components/ManualInputFAB";
import { ThemeToggle } from "../shared/components/ThemeToggle";
import { ToastContainer } from "../shared/components/Toast";
import type { ToastItem } from "../shared/components/Toast";
import { useClipboardStore } from "../features/clipboard/store/clipboardStore";
import { exportToJSON } from "../features/clipboard/services/exportService";
import { nanoid } from "nanoid";
import { useClipboardHistory } from "../features/clipboard/hooks/useClipboardHistory";

const AnalyticsPanel = lazy(() =>
  import("../features/clipboard/components/AnalyticsPanel").then((m) => ({
    default: m.AnalyticsPanel,
  }))
);

function ShortcutsHint() {
  const [open, setOpen] = useState(false);
  const shortcuts = [
    ["Ctrl+K", "Command palette"],
    ["Ctrl+Shift+F", "Focus search"],
    ["Ctrl+1–7", "Switch category"],
    ["Ctrl+Shift+X", "Clear all"],
    ["Ctrl+E", "Export"],
    ["Ctrl+Shift+A", "Toggle analytics"],
    ["↑↓ + Enter", "Navigate & copy"],
    ["Escape", "Clear search"],
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title="Keyboard shortcuts"
      >
        <Keyboard size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 w-64">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Keyboard Shortcuts
            </p>
            <div className="space-y-1">
              {shortcuts.map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <kbd className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    {key}
                  </kbd>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const { permissionState } = useClipboard();
  const rawItems = useClipboardStore((s) => s.items);
  const allItems = useMemo(() => rawItems.filter((i) => !i.isDeleted), [rawItems]);
  const { filteredItems } = useClipboardHistory();

  const addToast = useCallback((message: string, type: ToastItem["type"] = "info") => {
    const id = nanoid();
    setToasts((t) => [...t, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const handleExport = useCallback(() => {
    exportToJSON(allItems);
    addToast("Exported to JSON", "success");
  }, [allItems, addToast]);

  useKeyboardShortcuts({
    onOpenCommandPalette: () => setCommandPaletteOpen(true),
    onFocusSearch: () => searchRef.current?.focus(),
    onToggleAnalytics: () => setAnalyticsOpen((a) => !a),
    onExport: handleExport,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            🗂 Smart Clipboard
          </span>
        </div>
        <div className="flex-1">
          <SearchBar inputRef={searchRef} />
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ShortcutsHint />
        </div>
      </header>

      {/* Permission Banner */}
      <PermissionBanner permissionState={permissionState} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-3">
          <CategoryFilter
            onToggleAnalytics={() => setAnalyticsOpen((a) => !a)}
            analyticsOpen={analyticsOpen}
          />
          {analyticsOpen && (
            <Suspense fallback={<div className="p-4 text-sm text-slate-400">Loading...</div>}>
              <AnalyticsPanel />
            </Suspense>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Sort Bar */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {filteredItems.length} items
            </p>
            <SortControl />
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <PinnedItems />
            <ClipboardList />
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleAnalytics={() => setAnalyticsOpen((a) => !a)}
      />

      {/* Mobile FAB */}
      <ManualInputFAB />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}