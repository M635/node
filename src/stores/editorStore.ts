import { create } from "zustand";
import {
  defaultEditorConfig,
  type EditorConfig,
  type Macro,
} from "../types/editor";
import type { ThemeMode } from "../types/theme";

interface EditorStore {
  config: EditorConfig;
  themeMode: ThemeMode;
  isDark: boolean;
  macros: Macro[];
  isRecordingMacro: boolean;
  currentMacro: Macro | null;
  bookmarks: Map<string, number[]>;

  updateConfig: (updates: Partial<EditorConfig>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setIsDark: (isDark: boolean) => void;
  startMacroRecording: () => void;
  stopMacroRecording: () => void;
  saveMacro: (macro: Macro) => void;
  deleteMacro: (id: string) => void;
  toggleBookmark: (tabId: string, line: number) => void;
  getBookmarks: (tabId: string) => number[];
  clearBookmarks: (tabId: string) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  config: { ...defaultEditorConfig },
  themeMode: "auto",
  isDark: false,
  macros: [],
  isRecordingMacro: false,
  currentMacro: null,
  bookmarks: new Map(),

  updateConfig: (updates) =>
    set((state) => ({
      config: { ...state.config, ...updates },
    })),

  setThemeMode: (mode) => set({ themeMode: mode }),
  setIsDark: (isDark) => set({ isDark }),

  startMacroRecording: () =>
    set({
      isRecordingMacro: true,
      currentMacro: {
        id: `macro-${Date.now()}`,
        name: `Macro ${get().macros.length + 1}`,
        actions: [],
        enabled: true,
      },
    }),

  stopMacroRecording: () =>
    set((state) => {
      if (state.currentMacro) {
        return {
          isRecordingMacro: false,
          macros: [...state.macros, state.currentMacro],
          currentMacro: null,
        };
      }
      return { isRecordingMacro: false };
    }),

  saveMacro: (macro) =>
    set((state) => ({
      macros: state.macros.some((m) => m.id === macro.id)
        ? state.macros.map((m) => (m.id === macro.id ? macro : m))
        : [...state.macros, macro],
    })),

  deleteMacro: (id) =>
    set((state) => ({
      macros: state.macros.filter((m) => m.id !== id),
    })),

  toggleBookmark: (tabId, line) =>
    set((state) => {
      const newBookmarks = new Map(state.bookmarks);
      const current = newBookmarks.get(tabId) || [];
      if (current.includes(line)) {
        newBookmarks.set(
          tabId,
          current.filter((l) => l !== line)
        );
      } else {
        newBookmarks.set(tabId, [...current, line].sort((a, b) => a - b));
      }
      return { bookmarks: newBookmarks };
    }),

  getBookmarks: (tabId) => get().bookmarks.get(tabId) || [],

  clearBookmarks: (tabId) =>
    set((state) => {
      const newBookmarks = new Map(state.bookmarks);
      newBookmarks.delete(tabId);
      return { bookmarks: newBookmarks };
    }),
}));
