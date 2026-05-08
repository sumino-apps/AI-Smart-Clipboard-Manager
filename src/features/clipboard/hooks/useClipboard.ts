import { useState, useEffect, useCallback } from "react";
import { useClipboardStore } from "../store/clipboardStore";

export function useClipboard() {
  const addItem = useClipboardStore((s) => s.addItem);
  const [permissionState, setPermissionState] = useState<
    PermissionState | "unsupported"
  >("prompt");

  const readClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text?.trim()) addItem(text.trim());
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setPermissionState("denied");
      }
    }
  }, [addItem]);

  useEffect(() => {
    navigator.permissions
      ?.query({ name: "clipboard-read" as PermissionName })
      .then((status) => {
        setPermissionState(status.state);
        status.onchange = () => setPermissionState(status.state);
      })
      .catch(() => setPermissionState("unsupported"));

    const onFocus = () => void readClipboard();
    const onVisibility = () => {
      if (!document.hidden) void readClipboard();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [readClipboard]);

  return { permissionState, readClipboard };
}