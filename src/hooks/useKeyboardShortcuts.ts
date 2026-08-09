import { useEffect } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

interface ShortcutHandlers {
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
  onEncoding?: () => void;
  onSettings?: () => void;
  onToggleSidebar?: () => void;
  onCommandPalette?: () => void;
  onShortcutsHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    (async () => {
      unlisten = await listen<string>("menu-event", (event) => {
        const id = event.payload;
        switch (id) {
          case "save": handlers.onSave?.(); break;
          case "find": handlers.onFind?.(); break;
          case "replace": handlers.onReplace?.(); break;
          case "goto": handlers.onGotoLine?.(); break;
          case "new": handlers.onNewFile?.(); break;
          case "open": handlers.onOpenFile?.(); break;
          case "close": handlers.onCloseTab?.(); break;
          case "find_in_files": handlers.onFindInFiles?.(); break;
          case "encoding": handlers.onEncoding?.(); break;
          case "settings": handlers.onSettings?.(); break;
          case "toggle_sidebar": handlers.onToggleSidebar?.(); break;
          case "command_palette": handlers.onCommandPalette?.(); break;
          case "shortcuts": handlers.onShortcutsHelp?.(); break;
        }
      });
    })();

    const handleCustomEvent = (e: Event) => {
      const type = (e as CustomEvent).type;
      switch (type) {
        case "markpt:save": handlers.onSave?.(); break;
        case "markpt:find": handlers.onFind?.(); break;
        case "markpt:replace": handlers.onReplace?.(); break;
        case "markpt:goto-line": handlers.onGotoLine?.(); break;
        case "markpt:new-file": handlers.onNewFile?.(); break;
        case "markpt:open-file": handlers.onOpenFile?.(); break;
        case "markpt:close-tab": handlers.onCloseTab?.(); break;
        case "markpt:find-in-files": handlers.onFindInFiles?.(); break;
        case "markpt:toggle-bookmark": handlers.onToggleBookmark?.(); break;
        case "markpt:next-bookmark": handlers.onNextBookmark?.(); break;
        case "markpt:toggle-macro": handlers.onToggleMacro?.(); break;
        case "markpt:play-macro": handlers.onPlayMacro?.(); break;
        case "markpt:toggle-diff": handlers.onToggleDiff?.(); break;
        case "markpt:encoding": handlers.onEncoding?.(); break;
        case "markpt:settings": handlers.onSettings?.(); break;
      }
    };

    const events = [
      "markpt:save", "markpt:find", "markpt:replace", "markpt:goto-line",
      "markpt:new-file", "markpt:open-file", "markpt:close-tab",
      "markpt:find-in-files", "markpt:toggle-bookmark", "markpt:next-bookmark",
      "markpt:toggle-macro", "markpt:play-macro", "markpt:toggle-diff",
      "markpt:encoding", "markpt:settings",
    ];

    events.forEach((evt) => window.addEventListener(evt, handleCustomEvent));

    return () => {
      if (unlisten) unlisten();
      events.forEach((evt) => window.removeEventListener(evt, handleCustomEvent));
    };
  }, [handlers]);
}
