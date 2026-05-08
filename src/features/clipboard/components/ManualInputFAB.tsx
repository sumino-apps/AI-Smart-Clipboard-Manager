import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClipboardStore } from "../store/clipboardStore";

export function ManualInputFAB() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const addItem = useClipboardStore((s) => s.addItem);

  const handleSubmit = () => {
    if (text.trim()) {
      addItem(text.trim());
      setText("");
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 z-30 md:hidden"
        title="Add item manually"
      >
        <Plus size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Add clipboard item</h3>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your content here..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none resize-none focus:border-indigo-400 dark:focus:border-indigo-500"
                rows={4}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check size={15} /> Add Item
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}