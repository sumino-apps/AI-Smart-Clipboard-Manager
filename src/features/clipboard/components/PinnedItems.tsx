import { AnimatePresence, motion } from "framer-motion";
import { Pin } from "lucide-react";
import { ClipboardCard } from "./ClipboardCard";
import { useClipboardHistory } from "../hooks/useClipboardHistory";

export function PinnedItems() {
  const { pinnedItems } = useClipboardHistory();
  if (pinnedItems.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-3">
        <Pin size={14} className="text-indigo-500 dark:text-indigo-400" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Pinned
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {pinnedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              <ClipboardCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 border-t border-slate-200 dark:border-slate-700" />
    </div>
  );
}