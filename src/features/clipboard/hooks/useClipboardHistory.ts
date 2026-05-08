import { useMemo } from "react";
import { useClipboardStore } from "../store/clipboardStore";
import type { ClipboardItem } from "../types/clipboard.types";

export function useClipboardHistory() {
  const items = useClipboardStore((s) => s.items);
  const filter = useClipboardStore((s) => s.filter);

  const filteredItems = useMemo(() => {
    let result = items.filter((i) => !i.isDeleted);

    if (filter.category !== "all") {
      result = result.filter((i) => i.category === filter.category);
    }

    if (filter.showFavoritesOnly) {
      result = result.filter((i) => i.isFavorite);
    }

    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.content.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.note?.toLowerCase().includes(q)
      );
    }

    const pinned = result.filter((i) => i.isPinned);
    const unpinned = result.filter((i) => !i.isPinned);

    const sortFn = (a: ClipboardItem, b: ClipboardItem) => {
      switch (filter.sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "mostUsed":
          return b.copyCount - a.copyCount;
        case "alphabetical":
          return a.content.localeCompare(b.content);
        default:
          return 0;
      }
    };

    return [...pinned.sort(sortFn), ...unpinned.sort(sortFn)];
  }, [items, filter]);

  const pinnedItems = useMemo(
    () => filteredItems.filter((i) => i.isPinned),
    [filteredItems]
  );

  const unpinnedItems = useMemo(
    () => filteredItems.filter((i) => !i.isPinned),
    [filteredItems]
  );

  return { filteredItems, pinnedItems, unpinnedItems };
}