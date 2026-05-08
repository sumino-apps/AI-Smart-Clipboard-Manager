import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface Props {
  permissionState: PermissionState | "unsupported";
}

export function PermissionBanner({ permissionState }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || permissionState === "granted" || permissionState === "prompt") return null;

  return (
    <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-sm">
      <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
      <div className="flex-1">
        <span className="font-medium text-amber-800 dark:text-amber-300">Clipboard access {permissionState === "denied" ? "denied" : "unsupported"}</span>
        <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
          {permissionState === "denied"
            ? "Allow clipboard access in browser settings to enable auto-capture. You can still paste items manually."
            : "Your browser does not support clipboard-read permission. Use the paste button to add items manually."}
        </p>
      </div>
      <button onClick={() => setDismissed(true)} className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300">
        <X size={14} />
      </button>
    </div>
  );
}