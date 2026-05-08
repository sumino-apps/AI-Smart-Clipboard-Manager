import type { ClipboardItem } from "../types/clipboard.types";

export function exportToJSON(items: ClipboardItem[]): void {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clipboard-export-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToTXT(items: ClipboardItem[]): void {
  const text = items.map((i) => i.content).join("\n----\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clipboard-export-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importFromJSON(file: File): Promise<ClipboardItem[]> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("Invalid export file");
  return (parsed as ClipboardItem[]).filter(
    (item) => item.id && item.content && item.createdAt
  );
}