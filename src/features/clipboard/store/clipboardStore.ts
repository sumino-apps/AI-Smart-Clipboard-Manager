import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorageAdapter } from "../services/idbStorageAdapter";
import { detectCategory } from "../services/categoryDetector";
import { generateTags } from "../services/autoTagger";
import { detectSensitive } from "../utils/sensitiveDetector";
import { nanoid } from "nanoid";
import type {
  ClipboardStore,
  ClipboardItem,
  ClipboardFilter,
  ClipboardAnalytics,
  ClipboardCategory,
} from "../types/clipboard.types";

const MAX_ITEMS = 500;

const defaultFilter: ClipboardFilter = {
  search: "",
  category: "all",
  showFavoritesOnly: false,
  sortBy: "newest",
};

export const useClipboardStore = create<ClipboardStore>()(
  persist(
    (set, get) => ({
      items: [],
      filter: defaultFilter,
      isListening: false,

      addItem: (content: string) => {
        const trimmed = content.trim();
        if (!trimmed || trimmed.length > 50_000) return;

        const existing = get().items.find((i) => i.content === trimmed && !i.isDeleted);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id
                ? { ...i, lastCopiedAt: Date.now(), copyCount: i.copyCount + 1 }
                : i
            ),
          }));
          return;
        }

        const { category } = detectCategory(trimmed);
        const tags = generateTags(trimmed);
        const sensitiveLabel = detectSensitive(trimmed);

        const item: ClipboardItem = {
          id: nanoid(),
          content: trimmed,
          category,
          tags,
          isFavorite: false,
          isPinned: false,
          isDeleted: false,
          copyCount: 1,
          createdAt: Date.now(),
          lastCopiedAt: Date.now(),
          characterCount: trimmed.length,
          wordCount: trimmed.split(/\s+/).filter(Boolean).length,
          isSensitive: !!sensitiveLabel,
        };

        set((state) => ({
          items: [item, ...state.items].slice(0, MAX_ITEMS),
        }));
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, isDeleted: true } : i
          ),
        }));
      },

      toggleFavorite: (id: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
          ),
        }));
      },

      togglePin: (id: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, isPinned: !i.isPinned } : i
          ),
        }));
      },

      copyItem: async (id: string) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        await navigator.clipboard.writeText(item.content);
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, lastCopiedAt: Date.now(), copyCount: i.copyCount + 1 }
              : i
          ),
        }));
      },

      updateNote: (id: string, note: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, note } : i
          ),
        }));
      },

      clearAll: () => {
        set((state) => ({
          items: state.items.map((i) => ({ ...i, isDeleted: true })),
        }));
      },

      setFilter: (patch: Partial<ClipboardFilter>) => {
        set((state) => ({ filter: { ...state.filter, ...patch } }));
      },

      startListening: () => set({ isListening: true }),
      stopListening: () => set({ isListening: false }),

      getAnalytics: (): ClipboardAnalytics => {
        const items = get().items.filter((i) => !i.isDeleted);
        const today = new Date().toDateString();

        const categoryBreakdown = items.reduce(
          (acc, item) => {
            acc[item.category] = (acc[item.category] ?? 0) + 1;
            return acc;
          },
          {} as Record<ClipboardCategory, number>
        );

        const dailyActivity: Record<string, number> = {};
        const last30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
        items
          .filter((i) => i.createdAt > last30)
          .forEach((i) => {
            const day = new Date(i.createdAt).toISOString().split("T")[0] ?? "";
            dailyActivity[day] = (dailyActivity[day] ?? 0) + 1;
          });

        return {
          totalItems: items.length,
          totalCopies: items.reduce((s, i) => s + i.copyCount, 0),
          categoryBreakdown,
          mostCopiedItem:
            [...items].sort((a, b) => b.copyCount - a.copyCount)[0] ?? null,
          todayCount: items.filter(
            (i) => new Date(i.createdAt).toDateString() === today
          ).length,
          avgCharLength: items.length
            ? Math.round(
                items.reduce((s, i) => s + i.characterCount, 0) / items.length
              )
            : 0,
          dailyActivity,
        };
      },
    }),
    {
      name: "clipboard-store",
      storage: createJSONStorage(() => idbStorageAdapter),
      partialize: (state) => ({ items: state.items }),
    }
  )
);