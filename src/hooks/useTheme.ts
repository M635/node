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

    (async () => {
      try {
        const win = getCurrentWindow();
        const theme = await win.theme();
        setIsDark(theme === "dark");

        const unlisten = await win.onThemeChanged((newTheme: { payload: string }) => {
          setIsDark(newTheme.payload === "dark");
        });
        cleanup = unlisten;
      } catch {
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
      if (cleanup) cleanup();
    };
  }, [mode]);

  return { isDark };
}
