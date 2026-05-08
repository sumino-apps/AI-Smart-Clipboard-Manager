import { ClipboardX } from "lucide-react";
import { useClipboardStore } from "../store/clipboardStore";

export function EmptyState() {
  const search = useClipboardStore((s) => s.filter.search);
  const category = useClipboardStore((s) => s.filter.category);
  const totalItems = useClipboardStore((s) => s.items.filter((i) => !i.isDeleted).length);

  const isFiltered = search || category !== "all";

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-6">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
        <ClipboardX size={32} className="text-slate-400 dark:text-slate-500" />
      </div>
      {totalItems === 0 ? (
        <>
          <h3 className="font-semibold text-slate-600 dark:text-slate-400">Your clipboard history is empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Copy something and switch back — the app will automatically capture it.
          </p>
        </>
      ) : isFiltered ? (
        <>
          <h3 className="font-semibold text-slate-600 dark:text-slate-400">No results found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Try a different search term or category filter.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-slate-600 dark:text-slate-400">Nothing here</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            No items match the current filter.
          </p>
        </>
      )}
    </div>
  );
}