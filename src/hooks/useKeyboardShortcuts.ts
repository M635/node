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
  onEditAction?: (action: string) => void;
  onSplitHorizontal?: () => void;
  onSplitVertical?: () => void;
  onSplitClose?: () => void;
  onFunctionList?: () => void;
  onToggleWordWrap?: () => void;
  onCharStats?: () => void;
  onHexViewer?: () => void;
  onMultiDocSearch?: () => void;
  onTextTransform?: () => void;
  onInsertDateTime?: () => void;
  onSpecialChar?: () => void;
  onColorPicker?: () => void;
  onDocSwitcher?: () => void;
  onBatchFindReplace?: () => void;
  onFileProps?: () => void;
  onShortcutMapper?: () => void;
  onEolConvert?: (target: "lf" | "crlf" | "cr") => void;
  onTabSpaceConvert?: (direction: "tab-to-space" | "space-to-tab") => void;
  onFormatCode?: () => void;
  onMarkdownPreview?: () => void;
  onRegexTester?: () => void;
  onCsvViewer?: () => void;
  onLanguageSelector?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onFindNext?: () => void;
  onFindPrev?: () => void;
  onNextBookmark?: () => void;
  onPrevBookmark?: () => void;
  onClearBookmarks?: () => void;
  onJumpToBracket?: () => void;
  onSelectToBracket?: () => void;
  onCopyPath?: () => void;
  onReloadFromDisk?: () => void;
  onInsertFile?: () => void;
  onFullScreen?: () => void;
  onAlwaysOnTop?: () => void;
  onFormatJson?: () => void;
  onFormatXml?: () => void;
  onFormatHtml?: () => void;
  onFormatCss?: () => void;
  onFormatSql?: () => void;
  onCharConvert?: (action: string) => void;
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
          case "edit_delete_line": handlers.onEditAction?.("delete-line"); break;
          case "edit_duplicate_line": handlers.onEditAction?.("duplicate-line"); break;
          case "edit_move_up": handlers.onEditAction?.("move-up"); break;
          case "edit_move_down": handlers.onEditAction?.("move-down"); break;
          case "edit_delete_blank": handlers.onEditAction?.("delete-blank"); break;
          case "edit_trim_trailing": handlers.onEditAction?.("trim-trailing"); break;
          case "edit_toggle_comment": handlers.onEditAction?.("toggle-comment"); break;
          case "edit_upper": handlers.onEditAction?.("upper"); break;
          case "edit_lower": handlers.onEditAction?.("lower"); break;
          case "edit_sort_asc": handlers.onEditAction?.("sort-asc"); break;
          case "edit_sort_desc": handlers.onEditAction?.("sort-desc"); break;
          case "edit_remove_dup": handlers.onEditAction?.("remove-duplicates"); break;
          case "edit_undo": handlers.onEditAction?.("undo"); break;
          case "edit_redo": handlers.onEditAction?.("redo"); break;
          case "split_horizontal": handlers.onSplitHorizontal?.(); break;
          case "split_vertical": handlers.onSplitVertical?.(); break;
          case "split_close": handlers.onSplitClose?.(); break;
          case "function_list": handlers.onFunctionList?.(); break;
          case "toggle_word_wrap": handlers.onToggleWordWrap?.(); break;
          case "char_stats": handlers.onCharStats?.(); break;
          case "hex_viewer": handlers.onHexViewer?.(); break;
          case "multi_search": handlers.onMultiDocSearch?.(); break;
          case "text_transform": handlers.onTextTransform?.(); break;
          case "insert_datetime": handlers.onInsertDateTime?.(); break;
          case "special_char": handlers.onSpecialChar?.(); break;
          case "color_picker": handlers.onColorPicker?.(); break;
          case "doc_switcher": handlers.onDocSwitcher?.(); break;
          case "batch_find_replace": handlers.onBatchFindReplace?.(); break;
          case "file_props": handlers.onFileProps?.(); break;
          case "shortcut_mapper": handlers.onShortcutMapper?.(); break;
          case "eol_lf": handlers.onEolConvert?.("lf"); break;
          case "eol_crlf": handlers.onEolConvert?.("crlf"); break;
          case "eol_cr": handlers.onEolConvert?.("cr"); break;
          case "tab_to_space": handlers.onTabSpaceConvert?.("tab-to-space"); break;
          case "space_to_tab": handlers.onTabSpaceConvert?.("space-to-tab"); break;
          case "format_code": handlers.onFormatCode?.(); break;
          case "markdown_preview": handlers.onMarkdownPreview?.(); break;
          case "regex_tester": handlers.onRegexTester?.(); break;
          case "csv_viewer": handlers.onCsvViewer?.(); break;
          case "language_selector": handlers.onLanguageSelector?.(); break;
          case "zoom_in": handlers.onZoomIn?.(); break;
          case "zoom_out": handlers.onZoomOut?.(); break;
          case "zoom_reset": handlers.onZoomReset?.(); break;
          case "find_next": handlers.onFindNext?.(); break;
          case "find_prev": handlers.onFindPrev?.(); break;
          case "next_bookmark": handlers.onNextBookmark?.(); break;
          case "prev_bookmark": handlers.onPrevBookmark?.(); break;
          case "clear_bookmarks": handlers.onClearBookmarks?.(); break;
          case "jump_to_bracket": handlers.onJumpToBracket?.(); break;
          case "select_to_bracket": handlers.onSelectToBracket?.(); break;
          case "copy_path": handlers.onCopyPath?.(); break;
          case "reload_from_disk": handlers.onReloadFromDisk?.(); break;
          case "insert_file": handlers.onInsertFile?.(); break;
          case "full_screen": handlers.onFullScreen?.(); break;
          case "always_on_top": handlers.onAlwaysOnTop?.(); break;
          case "format_json": handlers.onFormatJson?.(); break;
          case "format_xml": handlers.onFormatXml?.(); break;
          case "format_html": handlers.onFormatHtml?.(); break;
          case "format_css": handlers.onFormatCss?.(); break;
          case "format_sql": handlers.onFormatSql?.(); break;
          case "char_full_width": handlers.onCharConvert?.("to-full-width"); break;
          case "char_half_width": handlers.onCharConvert?.("to-half-width"); break;
          case "char_remove_non_printable": handlers.onCharConvert?.("remove-non-printable"); break;
          case "char_normalize_nfc": handlers.onCharConvert?.("normalize-nfc"); break;
          case "char_normalize_nfd": handlers.onCharConvert?.("normalize-nfd"); break;
          case "char_to_snake": handlers.onCharConvert?.("to-snake"); break;
          case "char_to_camel": handlers.onCharConvert?.("to-camel"); break;
          case "char_to_pascal": handlers.onCharConvert?.("to-pascal"); break;
          case "char_to_kebab": handlers.onCharConvert?.("to-kebab"); break;
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
