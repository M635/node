import { create } from "zustand";

interface ClipboardItem {
  text: string;
  timestamp: number;
}

interface ClipboardStore {
  history: ClipboardItem[];
  addItem: (text: string) => void;
  clearHistory: () => void;
  getItem: (index: number) => string | null;
}

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  history: [],
  addItem: (text) => {
    if (!text || text.length === 0) return;
    set((state) => ({
      history: [
        { text, timestamp: Date.now() },
        ...state.history.filter((item) => item.text !== text),
      ].slice(0, 50),
    }));
  },
  clearHistory: () => set({ history: [] }),
  getItem: (index) => {
    const item = get().history[index];
    return item ? item.text : null;
  },
}));

export function initClipboardListener(): () => void {
  const handler = (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData("text");
    if (text) useClipboardStore.getState().addItem(text);
  };
  document.addEventListener("copy", handler);
  document.addEventListener("cut", handler);
  document.addEventListener("paste", handler);
  const customHandler = (e: Event) => {
    const text = (e as CustomEvent).detail?.text;
    if (text) useClipboardStore.getState().addItem(text);
  };
  window.addEventListener("markpt:editor-copy", customHandler);
  window.addEventListener("markpt:editor-cut", customHandler);
  return () => {
    document.removeEventListener("copy", handler);
    document.removeEventListener("cut", handler);
    document.removeEventListener("paste", handler);
    window.removeEventListener("markpt:editor-copy", customHandler);
    window.removeEventListener("markpt:editor-cut", customHandler);
  };
}
