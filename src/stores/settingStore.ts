import { create } from "zustand";
import { defaultEditorConfig } from "../types/editor";
import type { ThemeMode } from "../types/theme";

interface SettingStore {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
  showWhitespace: boolean;
  showMinimap: boolean;
  themeMode: ThemeMode;
  autoIndent: boolean;
  bracketPairColorization: boolean;
  folding: boolean;
  recentFiles: string[];
  showStatusBar: boolean;
  trimTrailingWhitespaceOnSave: boolean;
  ensureFinalNewline: boolean;
  autoDetectIndent: boolean;
  showIndentGuides: boolean;
  showRuler: boolean;
  customShortcuts: Record<string, string>;
  smartHighlightEnabled: boolean;
  smartHighlightMinLength: number;
  smartHighlightMaxMatches: number;
  matchHighlightEnabled: boolean;
  matchHighlightPattern: string;

  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setTabSize: (size: number) => void;
  setInsertSpaces: (insert: boolean) => void;
  setWordWrap: (wrap: boolean) => void;
  setShowLineNumbers: (show: boolean) => void;
  setShowWhitespace: (show: boolean) => void;
  setShowMinimap: (show: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setAutoIndent: (auto: boolean) => void;
  setBracketPairColorization: (enable: boolean) => void;
  setFolding: (enable: boolean) => void;
  addRecentFile: (path: string) => void;
  setShowStatusBar: (show: boolean) => void;
  setTrimTrailingWhitespaceOnSave: (enable: boolean) => void;
  setEnsureFinalNewline: (enable: boolean) => void;
  setAutoDetectIndent: (enable: boolean) => void;
  setShowIndentGuides: (enable: boolean) => void;
  setShowRuler: (show: boolean) => void;
  setCustomShortcut: (action: string, shortcut: string) => void;
  resetCustomShortcut: (action: string) => void;
  resetAllCustomShortcuts: () => void;
  setSmartHighlightEnabled: (enabled: boolean) => void;
  setSmartHighlightMinLength: (length: number) => void;
  setSmartHighlightMaxMatches: (max: number) => void;
  setMatchHighlightEnabled: (enabled: boolean) => void;
  setMatchHighlightPattern: (pattern: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "markpt:settings";

interface PersistedSettings {
  fontSize?: number;
  fontFamily?: string;
  tabSize?: number;
  insertSpaces?: boolean;
  wordWrap?: boolean;
  showLineNumbers?: boolean;
  showWhitespace?: boolean;
  showMinimap?: boolean;
  themeMode?: ThemeMode;
  autoIndent?: boolean;
  bracketPairColorization?: boolean;
  folding?: boolean;
  recentFiles?: string[];
  showStatusBar?: boolean;
  trimTrailingWhitespaceOnSave?: boolean;
  ensureFinalNewline?: boolean;
  autoDetectIndent?: boolean;
  showIndentGuides?: boolean;
  showRuler?: boolean;
  customShortcuts?: Record<string, string>;
  smartHighlightEnabled?: boolean;
  smartHighlightMinLength?: number;
  smartHighlightMaxMatches?: number;
  matchHighlightEnabled?: boolean;
  matchHighlightPattern?: string;
}

/** 读取已保存的设置；失败或不可用时返回空对象（使用默认值）。 */
function loadPersistedSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) return parsed as PersistedSettings;
  } catch {
    // 忽略损坏的数据
  }
  return {};
}

function persistSettings(state: SettingStore): void {
  try {
    const data: PersistedSettings = {
      fontSize: state.fontSize,
      fontFamily: state.fontFamily,
      tabSize: state.tabSize,
      insertSpaces: state.insertSpaces,
      wordWrap: state.wordWrap,
      showLineNumbers: state.showLineNumbers,
      showWhitespace: state.showWhitespace,
      showMinimap: state.showMinimap,
      themeMode: state.themeMode,
      autoIndent: state.autoIndent,
      bracketPairColorization: state.bracketPairColorization,
      folding: state.folding,
      recentFiles: state.recentFiles,
      showStatusBar: state.showStatusBar,
      trimTrailingWhitespaceOnSave: state.trimTrailingWhitespaceOnSave,
      ensureFinalNewline: state.ensureFinalNewline,
      autoDetectIndent: state.autoDetectIndent,
      showIndentGuides: state.showIndentGuides,
      showRuler: state.showRuler,
      customShortcuts: state.customShortcuts,
      smartHighlightEnabled: state.smartHighlightEnabled,
      smartHighlightMinLength: state.smartHighlightMinLength,
      smartHighlightMaxMatches: state.smartHighlightMaxMatches,
      matchHighlightEnabled: state.matchHighlightEnabled,
      matchHighlightPattern: state.matchHighlightPattern,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 忽略存储失败
  }
}

const saved = loadPersistedSettings();

export const useSettingStore = create<SettingStore>((set) => ({
  fontSize: saved.fontSize ?? defaultEditorConfig.fontSize,
  fontFamily: saved.fontFamily ?? defaultEditorConfig.fontFamily,
  tabSize: saved.tabSize ?? defaultEditorConfig.tabSize,
  insertSpaces: saved.insertSpaces ?? defaultEditorConfig.insertSpaces,
  wordWrap: saved.wordWrap ?? defaultEditorConfig.wordWrap,
  showLineNumbers: saved.showLineNumbers ?? defaultEditorConfig.lineNumbers,
  showWhitespace: saved.showWhitespace ?? false,
  showMinimap: saved.showMinimap ?? defaultEditorConfig.minimap,
  themeMode: saved.themeMode ?? "auto",
  autoIndent: saved.autoIndent ?? defaultEditorConfig.autoIndent,
  bracketPairColorization: saved.bracketPairColorization ?? defaultEditorConfig.bracketPairColorization,
  folding: saved.folding ?? defaultEditorConfig.folding,
  recentFiles: saved.recentFiles ?? [],
  showStatusBar: saved.showStatusBar ?? true,
  trimTrailingWhitespaceOnSave: saved.trimTrailingWhitespaceOnSave ?? false,
  ensureFinalNewline: saved.ensureFinalNewline ?? true,
  autoDetectIndent: saved.autoDetectIndent ?? true,
  showIndentGuides: saved.showIndentGuides ?? true,
  showRuler: saved.showRuler ?? false,
  customShortcuts: saved.customShortcuts ?? {},
  smartHighlightEnabled: saved.smartHighlightEnabled ?? true,
  smartHighlightMinLength: saved.smartHighlightMinLength ?? 2,
  smartHighlightMaxMatches: saved.smartHighlightMaxMatches ?? 500,
  matchHighlightEnabled: saved.matchHighlightEnabled ?? false,
  matchHighlightPattern: saved.matchHighlightPattern ?? "",

  setFontSize: (size) => set({ fontSize: size }),
  setFontFamily: (family) => set({ fontFamily: family }),
  setTabSize: (size) => set({ tabSize: size }),
  setInsertSpaces: (insert) => set({ insertSpaces: insert }),
  setWordWrap: (wrap) => set({ wordWrap: wrap }),
  setShowLineNumbers: (show) => set({ showLineNumbers: show }),
  setShowWhitespace: (show) => set({ showWhitespace: show }),
  setShowMinimap: (show) => set({ showMinimap: show }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  setAutoIndent: (auto) => set({ autoIndent: auto }),
  setBracketPairColorization: (enable) =>
    set({ bracketPairColorization: enable }),
  setFolding: (enable) => set({ folding: enable }),
  addRecentFile: (path) =>
    set((state) => ({
      recentFiles: [
        path,
        ...state.recentFiles.filter((p) => p !== path),
      ].slice(0, 20),
    })),
  setShowStatusBar: (show) => set({ showStatusBar: show }),
  setTrimTrailingWhitespaceOnSave: (enable) => set({ trimTrailingWhitespaceOnSave: enable }),
  setEnsureFinalNewline: (enable) => set({ ensureFinalNewline: enable }),
  setAutoDetectIndent: (enable) => set({ autoDetectIndent: enable }),
  setShowIndentGuides: (enable) => set({ showIndentGuides: enable }),
  setShowRuler: (show) => set({ showRuler: show }),
  setCustomShortcut: (action, shortcut) =>
    set((state) => ({ customShortcuts: { ...state.customShortcuts, [action]: shortcut } })),
  resetCustomShortcut: (action) =>
    set((state) => {
      const next = { ...state.customShortcuts };
      delete next[action];
      return { customShortcuts: next };
    }),
  resetAllCustomShortcuts: () => set({ customShortcuts: {} }),
  setSmartHighlightEnabled: (enabled) => set({ smartHighlightEnabled: enabled }),
  setSmartHighlightMinLength: (length) => set({ smartHighlightMinLength: length }),
  setSmartHighlightMaxMatches: (max) => set({ smartHighlightMaxMatches: max }),
  setMatchHighlightEnabled: (enabled) => set({ matchHighlightEnabled: enabled }),
  setMatchHighlightPattern: (pattern) => set({ matchHighlightPattern: pattern }),
  resetToDefaults: () =>
    set({
      fontSize: defaultEditorConfig.fontSize,
      fontFamily: defaultEditorConfig.fontFamily,
      tabSize: defaultEditorConfig.tabSize,
      insertSpaces: defaultEditorConfig.insertSpaces,
      wordWrap: defaultEditorConfig.wordWrap,
      showLineNumbers: defaultEditorConfig.lineNumbers,
      showMinimap: defaultEditorConfig.minimap,
      autoIndent: defaultEditorConfig.autoIndent,
      bracketPairColorization: defaultEditorConfig.bracketPairColorization,
      folding: defaultEditorConfig.folding,
    }),
}));

// 设置变化时自动持久化，重启后设置仍然生效
useSettingStore.subscribe((state) => {
  persistSettings(state);
});
