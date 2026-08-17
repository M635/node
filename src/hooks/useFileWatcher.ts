import { useEffect, useRef } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { watchFile, unwatchFile } from "../services/tauri/fileService";

export function useFileWatcher(
  path: string | null,
  onFileChanged: (changedPath: string) => void
): void {
  const onFileChangedRef = useRef(onFileChanged);
  onFileChangedRef.current = onFileChanged;

  useEffect(() => {
    if (!path) return;

    let unlisten: UnlistenFn | null = null;
    let active = true;

    (async () => {
      unlisten = await listen<{ path: string }>("file-changed", (event) => {
        if (event.payload.path === path) {
          onFileChangedRef.current(path);
        }
      });

      if (!active) { unlisten(); unlisten = null; return; }
      await watchFile(path);
    })();

    return () => {
      active = false;
      if (unlisten) unlisten();
      unwatchFile(path).catch(() => {});
    };
  }, [path]);
}
