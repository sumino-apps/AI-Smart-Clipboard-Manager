import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "../lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = type === "success" ? CheckCircle : type === "error" ? AlertCircle : Info;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium",
        "animate-slide-in",
        type === "success" && "bg-emerald-600 text-white",
        type === "error" && "bg-red-600 text-white",
        type === "info" && "bg-slate-800 text-white dark:bg-slate-700"
      )}
    >
      <Icon size={16} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  );
}