import { openDB } from "idb";
import type { StateStorage } from "zustand/middleware";

const DB_NAME = "clipboard-manager";
const STORE_NAME = "zustand-state";
const DB_VERSION = 1;

const getDB = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

export const idbStorageAdapter: StateStorage = {
  getItem: async (key) => {
    const db = await getDB();
    return (await db.get(STORE_NAME, key)) ?? null;
  },
  setItem: async (key, value) => {
    const db = await getDB();
    await db.put(STORE_NAME, value, key);
  },
  removeItem: async (key) => {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
  },
};