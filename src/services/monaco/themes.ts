import type * as Monaco from "monaco-editor";

export function defineThemes(monaco: typeof Monaco): void {
  monaco.editor.defineTheme("macpad-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a8a8a", fontStyle: "italic" },
      { token: "keyword", foreground: "b5004f" },
      { token: "string", foreground: "1a7e3a" },
      { token: "number", foreground: "1a7e3a" },
      { token: "type", foreground: "7a3e9d" },
      { token: "function", foreground: "1e5fb6" },
      { token: "variable", foreground: "1d1d1f" },
      { token: "tag", foreground: "b5004f" },
      { token: "attribute.name", foreground: "1e5fb6" },
      { token: "delimiter", foreground: "636363" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#1d1d1f",
      "editorLineNumber.foreground": "#b0b0b0",
      "editorLineNumber.activeForeground": "#1d1d1f",
      "editor.lineHighlightBackground": "#f5f5f7",
      "editor.selectionBackground": "#b3d4ff",
      "editor.inactiveSelectionBackground": "#c8c8c8",
      "editorCursor.foreground": "#007aff",
      "editorWhitespace.foreground": "#d0d0d0",
      "editorIndentGuide.background": "#e0e0e0",
      "editorIndentGuide.activeBackground": "#b0b0b0",
      "editorBracketMatch.background": "#b3d4ff80",
      "editorBracketMatch.border": "#007aff",
      "editorGutter.background": "#ffffff",
      "editorOverviewRuler.border": "#e0e0e0",
      "editorWidget.background": "#f5f5f7",
      "editorWidget.border": "#d2d2d7",
      "input.background": "#ffffff",
      "input.border": "#d2d2d7",
      "list.activeSelectionBackground": "#007aff",
      "list.activeSelectionForeground": "#ffffff",
      "list.hoverBackground": "#f0f0f0",
    },
  });

  monaco.editor.defineTheme("macpad-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a9955", fontStyle: "italic" },
      { token: "keyword", foreground: "c586c0" },
      { token: "string", foreground: "ce9178" },
      { token: "number", foreground: "b5cea8" },
      { token: "type", foreground: "4ec9b0" },
      { token: "function", foreground: "dcdcaa" },
      { token: "variable", foreground: "9cdcfe" },
      { token: "tag", foreground: "569cd6" },
      { token: "attribute.name", foreground: "9cdcfe" },
      { token: "delimiter", foreground: "d4d4d4" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#c6c6c6",
      "editor.lineHighlightBackground": "#2a2a2a",
      "editor.selectionBackground": "#264f78",
      "editor.inactiveSelectionBackground": "#3a3d41",
      "editorCursor.foreground": "#aeafad",
      "editorWhitespace.foreground": "#333333",
      "editorIndentGuide.background": "#404040",
      "editorIndentGuide.activeBackground": "#707070",
      "editorBracketMatch.background": "#264f7880",
      "editorBracketMatch.border": "#0a84ff",
      "editorGutter.background": "#1e1e1e",
      "editorOverviewRuler.border": "#2a2a2a",
      "editorWidget.background": "#252526",
      "editorWidget.border": "#454545",
      "input.background": "#3c3c3c",
      "input.border": "#454545",
      "list.activeSelectionBackground": "#094771",
      "list.activeSelectionForeground": "#ffffff",
      "list.hoverBackground": "#2a2a2a",
    },
  });
}

export function getThemeName(isDark: boolean): string {
  return isDark ? "macpad-dark" : "macpad-light";
}
