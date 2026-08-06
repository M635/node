export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeConfig {
  mode: ThemeMode;
  monacoTheme: string;
  uiTheme: "light" | "dark";
}

export interface ThemeColors {
  background: string;
  foreground: string;
  accent: string;
  border: string;
  tabActive: string;
  tabInactive: string;
  statusBar: string;
  sidebar: string;
}

export const lightColors: ThemeColors = {
  background: "#ffffff",
  foreground: "#1d1d1f",
  accent: "#007aff",
  border: "#d2d2d7",
  tabActive: "#ffffff",
  tabInactive: "#f5f5f7",
  statusBar: "#f5f5f7",
  sidebar: "#f5f5f7",
};

export const darkColors: ThemeColors = {
  background: "#1e1e1e",
  foreground: "#d4d4d4",
  accent: "#0a84ff",
  border: "#3c3c3c",
  tabActive: "#1e1e1e",
  tabInactive: "#252526",
  statusBar: "#007acc",
  sidebar: "#252526",
};

export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark ? darkColors : lightColors;
}
