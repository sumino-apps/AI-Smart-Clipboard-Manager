import { useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ClipboardCard } from "./ClipboardCard";
import { EmptyState } from "./EmptyState";
import { useClipboardHistory } from "../hooks/useClipboardHistory";

export function ClipboardList() {
  const { unpinnedItems } = useClipboardHistory();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: unpinnedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 180, []),
    overscan: 5,
    gap: 12,
  });

  if (unpinnedItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <div ref={parentRef} className="overflow-auto flex-1">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <AnimatePresence mode="popLayout">
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = unpinnedItems[virtualItem.index];
            if (!item) return null;
            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <ClipboardCard item={item} />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}