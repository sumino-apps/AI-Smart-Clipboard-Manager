import { useEffect, useCallback, useRef } from "react";
import { useClipboardStore } from "../store/clipboardStore";

interface KeyboardShortcutsOptions {
  onOpenCommandPalette: () => void;
  onFocusSearch: () => void;
  onToggleAnalytics: () => void;
  onExport: () => void;
}

export function useKeyboardShortcuts({
  onOpenCommandPalette,
  onFocusSearch,
  onToggleAnalytics,
  onExport,
}: KeyboardShortcutsOptions) {
  const setFilter = useClipboardStore((s) => s.setFilter);
  const clearAll = useClipboardStore((s) => s.clearAll);
  const focusedIdRef = useRef<string | null>(null);

  const setFocusedId = useCallback((id: string | null) => {
    focusedIdRef.current = id;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "k") {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }

      if (ctrl && e.shiftKey && e.key === "F") {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      if (ctrl && e.shiftKey && e.key === "A") {
        e.preventDefault();
        onToggleAnalytics();
        return;
      }

      if (ctrl && e.key === "e") {
        e.preventDefault();
        onExport();
        return;
      }

      if (ctrl && e.shiftKey && e.key === "X") {
        e.preventDefault();
        if (window.confirm("Clear all clipboard history?")) clearAll();
        return;
      }

      if (ctrl && e.key === "1") {
        e.preventDefault();
        setFilter({ category: "all" });
      } else if (ctrl && e.key === "2") {
        e.preventDefault();
        setFilter({ category: "link" });
      } else if (ctrl && e.key === "3") {
        e.preventDefault();
        setFilter({ category: "email" });
      } else if (ctrl && e.key === "4") {
        e.preventDefault();
        setFilter({ category: "otp" });
      } else if (ctrl && e.key === "5") {
        e.preventDefault();
        setFilter({ category: "code" });
      } else if (ctrl && e.key === "6") {
        e.preventDefault();
        setFilter({ category: "phone" });
      } else if (ctrl && e.key === "7") {
        e.preventDefault();
        setFilter({ category: "text" });
      }
    },
    [onOpenCommandPalette, onFocusSearch, onToggleAnalytics, onExport, clearAll, setFilter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { setFocusedId };
}