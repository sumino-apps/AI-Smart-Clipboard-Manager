import { cn } from "../lib/utils";

interface KeyboardShortcutHintProps {
  keys: string[];
  className?: string;
}

export function KeyboardShortcutHint({ keys, className }: KeyboardShortcutHintProps) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {keys.map((key, i) => (
        <kbd
          key={i}
          className="px-1.5 py-0.5 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}