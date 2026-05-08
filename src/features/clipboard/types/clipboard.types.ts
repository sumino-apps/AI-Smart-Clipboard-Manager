export type ClipboardCategory =
  | "link"
  | "email"
  | "otp"
  | "code"
  | "phone"
  | "text"
  | "unknown";

export type SortOption = "newest" | "oldest" | "mostUsed" | "alphabetical";

export interface ClipboardItem {
  id: string;
  content: string;
  category: ClipboardCategory;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  copyCount: number;
  createdAt: number;
  lastCopiedAt: number;
  characterCount: number;
  wordCount: number;
  note?: string;
  isSensitive?: boolean;
}

export interface ClipboardFilter {
  search: string;
  category: ClipboardCategory | "all";
  showFavoritesOnly: boolean;
  sortBy: SortOption;
}

export interface ClipboardAnalytics {
  totalItems: number;
  totalCopies: number;
  categoryBreakdown: Record<ClipboardCategory, number>;
  mostCopiedItem: ClipboardItem | null;
  todayCount: number;
  avgCharLength: number;
  dailyActivity: Record<string, number>;
}

export interface ClipboardStore {
  items: ClipboardItem[];
  filter: ClipboardFilter;
  isListening: boolean;
  addItem: (content: string) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  copyItem: (id: string) => Promise<void>;
  updateNote: (id: string, note: string) => void;
  clearAll: () => void;
  setFilter: (patch: Partial<ClipboardFilter>) => void;
  startListening: () => void;
  stopListening: () => void;
  getAnalytics: () => ClipboardAnalytics;
}