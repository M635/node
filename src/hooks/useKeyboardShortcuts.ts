import { useEffect } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

export function useKeyboardShortcuts(handlers: {
  onSave?: () => void;
  onFind?: () => void;
  onReplace?: () => void;
  onGotoLine?: () => void;
  onNewFile?: () => void;
  onOpenFile?: () => void;
  onCloseTab?: () => void;
  onFindInFiles?: () => void;
  onToggleBookmark?: () => void;
  onNextBookmark?: () => void;
  onToggleMacro?: () => void;
  onPlayMacro?: () => void;
  onToggleDiff?: () => void;
}): void {
  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    (async () => {
      unlisten = await listen<string>("menu-event", (event) => {
        const id = event.payload;
        switch (id) {
          case "save":
            handlers.onSave?.();
            break;
          case "find":
            handlers.onFind?.();
            break;
          case "replace":
            handlers.onReplace?.();
            break;
          case "goto":
            handlers.onGotoLine?.();
            break;
          case "new":
            handlers.onNewFile?.();
            break;
          case "open":
            handlers.onOpenFile?.();
            break;
          case "close":
            handlers.onCloseTab?.();
            break;
          case "find_in_files":
            handlers.onFindInFiles?.();
            break;
        }
      });
    })();

    const handleCustomEvent = (e: Event) => {
      const type = (e as CustomEvent).type;
      switch (type) {
        case "macpad:save":
          handlers.onSave?.();
          break;
        case "macpad:find":
          handlers.onFind?.();
          break;
        case "macpad:replace":
          handlers.onReplace?.();
          break;
        case "macpad:goto-line":
          handlers.onGotoLine?.();
          break;
        case "macpad:new-file":
          handlers.onNewFile?.();
          break;
        case "macpad:open-file":
          handlers.onOpenFile?.();
          break;
        case "macpad:close-tab":
          handlers.onCloseTab?.();
          break;
        case "macpad:find-in-files":
          handlers.onFindInFiles?.();
          break;
        case "macpad:toggle-bookmark":
          handlers.onToggleBookmark?.();
          break;
        case "macpad:next-bookmark":
          handlers.onNextBookmark?.();
          break;
        case "macpad:toggle-macro":
          handlers.onToggleMacro?.();
          break;
        case "macpad:play-macro":
          handlers.onPlayMacro?.();
          break;
        case "macpad:toggle-diff":
          handlers.onToggleDiff?.();
          break;
      }
    };

    const events = [
      "macpad:save",
      "macpad:find",
      "macpad:replace",
      "macpad:goto-line",
      "macpad:new-file",
      "macpad:open-file",
      "macpad:close-tab",
      "macpad:find-in-files",
      "macpad:toggle-bookmark",
      "macpad:next-bookmark",
      "macpad:toggle-macro",
      "macpad:play-macro",
      "macpad:toggle-diff",
    ];

    events.forEach((evt) => window.addEventListener(evt, handleCustomEvent));

    return () => {
      if (unlisten) unlisten();
      events.forEach((evt) =>
        window.removeEventListener(evt, handleCustomEvent)
      );
    };
  }, [handlers]);
}
