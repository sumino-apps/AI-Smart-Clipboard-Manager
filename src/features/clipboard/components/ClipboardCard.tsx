import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Copy, Pin, Heart, Trash2, Eye, EyeOff, Check,
  Link, Mail, KeyRound, Code2, Phone, FileText, Tag, AlertTriangle
} from "lucide-react";
import type { ClipboardItem, ClipboardCategory } from "../types/clipboard.types";
import { useClipboardStore } from "../store/clipboardStore";
import { formatRelativeTime, cn } from "../../../shared/lib/utils";

const CATEGORY_CONFIG: Record<ClipboardCategory, { label: string; color: string; Icon: React.ElementType }> = {
  link:    { label: "Link",    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",    Icon: Link },
  email:   { label: "Email",   color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", Icon: Mail },
  otp:     { label: "OTP",    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", Icon: KeyRound },
  code:    { label: "Code",   color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", Icon: Code2 },
  phone:   { label: "Phone",  color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",    Icon: Phone },
  text:    { label: "Text",   color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",    Icon: FileText },
  unknown: { label: "Other",  color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",    Icon: FileText },
};

const cardVariants = {
  hidden:  { opacity: 0, y: -10, scale: 0.98 },
  visible: { opacity: 1, y: 0,   scale: 1,   transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { opacity: 0, x: -16,             transition: { duration: 0.12 } },
};

interface Props {
  item: ClipboardItem;
}

function ClipboardCardInner({ item }: Props) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.note ?? "");

  const copyItem = useClipboardStore((s) => s.copyItem);
  const toggleFavorite = useClipboardStore((s) => s.toggleFavorite);
  const togglePin = useClipboardStore((s) => s.togglePin);
  const removeItem = useClipboardStore((s) => s.removeItem);
  const updateNote = useClipboardStore((s) => s.updateNote);

  const cfg = CATEGORY_CONFIG[item.category];
  const CategoryIcon = cfg.Icon;
  const isOtp = item.category === "otp";
  const displayContent = isOtp && !revealed ? "•".repeat(Math.min(item.content.length, 8)) : item.content;

  const handleCopy = useCallback(async () => {
    await copyItem(item.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [copyItem, item.id]);

  const handleSaveNote = useCallback(() => {
    updateNote(item.id, noteText);
    setEditingNote(false);
  }, [updateNote, item.id, noteText]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        "rounded-xl border p-4 transition-shadow hover:shadow-md group",
        "bg-white dark:bg-slate-800/80",
        "border-slate-200 dark:border-slate-700",
        item.isPinned && "border-indigo-300 dark:border-indigo-600/60 bg-indigo-50/30 dark:bg-indigo-950/20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", cfg.color)}>
            <CategoryIcon size={11} />
            {cfg.label}
          </span>
          {item.isPinned && (
            <span className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">Pinned</span>
          )}
          {item.isSensitive && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle size={11} /> Sensitive
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
          {formatRelativeTime(item.lastCopiedAt)}
        </span>
      </div>

      {/* Content */}
      <div
        className={cn(
          "text-sm mb-2 overflow-hidden",
          "text-slate-700 dark:text-slate-300",
          item.category === "code" && "font-mono bg-slate-50 dark:bg-slate-900 rounded p-2 text-xs",
          isOtp && "font-mono tracking-widest text-lg font-bold text-center text-orange-600 dark:text-orange-400"
        )}
        style={{ maxHeight: "5rem", overflowY: "hidden", wordBreak: "break-all" }}
      >
        {displayContent}
      </div>

      {/* Tags + meta */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded"
          >
            <Tag size={9} />
            {tag}
          </span>
        ))}
        <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
          {item.characterCount} chars · {item.wordCount} words
          {item.copyCount > 1 && ` · ${item.copyCount}×`}
        </span>
      </div>

      {/* Note */}
      {editingNote ? (
        <div className="mb-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 resize-none"
            rows={2}
            placeholder="Add a note..."
            autoFocus
          />
          <div className="flex gap-1 mt-1">
            <button onClick={handleSaveNote} className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
            <button onClick={() => setEditingNote(false)} className="text-xs px-2 py-0.5 text-slate-500 hover:text-slate-700">Cancel</button>
          </div>
        </div>
      ) : item.note ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => setEditingNote(true)}>
          {item.note}
        </p>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            copied
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>

        {isOtp && (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={revealed ? "Hide OTP" : "Reveal OTP"}
          >
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}

        <button
          onClick={() => togglePin(item.id)}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            item.isPinned
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
              : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          )}
          title="Pin"
        >
          <Pin size={14} />
        </button>

        <button
          onClick={() => toggleFavorite(item.id)}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            item.isFavorite
              ? "text-rose-500 bg-rose-50 dark:bg-rose-900/30"
              : "text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          )}
          title="Favorite"
        >
          <Heart size={14} fill={item.isFavorite ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => setEditingNote(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Add note"
        >
          <FileText size={14} />
        </button>

        <button
          onClick={() => removeItem(item.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export const ClipboardCard = React.memo(ClipboardCardInner);