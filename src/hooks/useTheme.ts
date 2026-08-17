import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { ThemeMode } from "../types/theme";

export function useTheme(mode: ThemeMode): { isDark: boolean } {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (mode !== "auto") {
      setIsDark(mode === "dark");
      return;
    }

    let cleanup: (() => void) | null = null;
    let active = true;

    (async () => {
      try {
        const win = getCurrentWindow();
        const theme = await win.theme();
        if (!active) return;
        setIsDark(theme === "dark");

        const unlisten = await win.onThemeChanged((newTheme: { payload: string }) => {
          setIsDark(newTheme.payload === "dark");
        });
        if (!active) { unlisten(); return; }
        cleanup = unlisten;
      } catch {
        if (!active) return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
          setIsDark(e.matches);
        };
        mediaQuery.addEventListener("change", handler);
        cleanup = () => mediaQuery.removeEventListener("change", handler);
      }
    })();

    return () => {
      active = false;
      if (cleanup) cleanup();
    };
  }, [mode]);

  return { isDark };
}
