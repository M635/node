import { create } from "zustand";
import type { FileTab, EncodingType } from "../types/file";

interface FileStore {
  tabs: FileTab[];
  activeTabId: string | null;
  recentFiles: string[];

  openTab: (tab: FileTab) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<FileTab>) => void;
  updateContent: (id: string, content: string) => void;
  markClean: (id: string) => void;
  markDirty: (id: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  sortTabs: (by: "name" | "path" | "type" | "size") => void;
  addRecentFile: (path: string) => void;
  cloneTab: (id: string) => void;
  lockTab: (id: string) => void;
  unlockTab: (id: string) => void;
  setTabColor: (id: string, color: string | null) => void;
  getActiveTab: () => FileTab | null;
  getTabByPath: (path: string) => FileTab | null;
}

function generateId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useFileStore = create<FileStore>((set, get) => ({
  tabs: [],
  activeTabId: null,
  recentFiles: [],

  openTab: (tab) =>
    set((state) => {
      const existing = state.tabs.find((t) => t.path === tab.path && !t.is_new);
      if (existing) {
        return { activeTabId: existing.id };
      }
      return {
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      const tab = state.tabs.find((t) => t.id === id);
      if (tab?.is_locked) return state;
      const idx = state.tabs.findIndex((t) => t.id === id);
      const newTabs = state.tabs.filter((t) => t.id !== id);
      let newActive = state.activeTabId;
      if (state.activeTabId === id) {
        if (newTabs.length === 0) {
          newActive = null;
        } else if (idx < newTabs.length) {
          newActive = newTabs[idx].id;
        } else {
          newActive = newTabs[newTabs.length - 1].id;
        }
      }
      return { tabs: newTabs, activeTabId: newActive };
    }),

  closeOtherTabs: (id) =>
    set((state) => ({
      tabs: state.tabs.filter((t) => t.id === id),
      activeTabId: id,
    })),

  closeAllTabs: () => set({ tabs: [], activeTabId: null }),

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, updates) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  updateContent: (id, content) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, content, is_dirty: true } : t
      ),
    })),

  markClean: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, is_dirty: false } : t)),
    })),

  markDirty: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, is_dirty: true } : t)),
    })),

  reorderTabs: (fromIndex, toIndex) =>
    set((state) => {
      const newTabs = [...state.tabs];
      const [moved] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, moved);
      return { tabs: newTabs };
    }),

  sortTabs: (by) =>
    set((state) => {
      const sorted = [...state.tabs].sort((a, b) => {
        switch (by) {
          case "name":
            return a.name.localeCompare(b.name);
          case "path":
            return a.path.localeCompare(b.path);
          case "type":
            return a.language.localeCompare(b.language) || a.name.localeCompare(b.name);
          case "size":
            return (b.meta?.size || 0) - (a.meta?.size || 0);
          default:
            return 0;
        }
      });
      return { tabs: sorted };
    }),

  addRecentFile: (path) =>
    set((state) => ({
      recentFiles: [
        path,
        ...state.recentFiles.filter((p) => p !== path),
      ].slice(0, 20),
    })),

  cloneTab: (id) =>
    set((state) => {
      const tab = state.tabs.find((t) => t.id === id);
      if (!tab) return state;
      const cloned: FileTab = {
        ...tab,
        id: generateId(),
        is_dirty: true,
        is_locked: false,
        tab_color: null,
      };
      const idx = state.tabs.findIndex((t) => t.id === id);
      const newTabs = [...state.tabs.slice(0, idx + 1), cloned, ...state.tabs.slice(idx + 1)];
      return { tabs: newTabs, activeTabId: cloned.id };
    }),

  lockTab: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, is_locked: true } : t)),
    })),

  unlockTab: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, is_locked: false } : t)),
    })),

  setTabColor: (id, color) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, tab_color: color } : t)),
    })),

  getActiveTab: () => {
    const state = get();
    return state.tabs.find((t) => t.id === state.activeTabId) || null;
  },

  getTabByPath: (path) => {
    const state = get();
    return state.tabs.find((t) => t.path === path) || null;
  },
}));

export { generateId };
