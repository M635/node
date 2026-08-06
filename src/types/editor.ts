export interface EditorConfig {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
  renderWhitespace: "none" | "boundary" | "all";
  minimap: boolean;
  folding: boolean;
  bracketPairColorization: boolean;
  autoIndent: boolean;
  formatOnSave: boolean;
  cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid";
  cursorSmoothCaretAnimation: boolean;
  selectOnLineNumbers: boolean;
  roundedSelection: boolean;
  scrollBeyondLastLine: boolean;
  automaticLayout: boolean;
}

export const defaultEditorConfig: EditorConfig = {
  fontSize: 14,
  fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace",
  lineHeight: 20,
  tabSize: 4,
  insertSpaces: true,
  wordWrap: false,
  lineNumbers: true,
  renderWhitespace: "boundary",
  minimap: false,
  folding: true,
  bracketPairColorization: true,
  autoIndent: true,
  formatOnSave: false,
  cursorBlinking: "blink",
  cursorSmoothCaretAnimation: true,
  selectOnLineNumbers: true,
  roundedSelection: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
};

export interface Marker {
  id: string;
  line: number;
  type: "bookmark" | "error" | "warning" | "info";
}

export interface MacroAction {
  type: "insert" | "delete" | "replace" | "cursor" | "command";
  payload: unknown;
}

export interface Macro {
  id: string;
  name: string;
  actions: MacroAction[];
  enabled: boolean;
}
