import type { MacroAction, Macro } from "../../types/editor";
import type * as Monaco from "monaco-editor";
import { useI18n } from "../../stores/i18nStore";

export class MacroRecorder {
  private actions: MacroAction[] = [];
  private isRecording = false;
  private name: string = "";

  start(name?: string): void {
    this.isRecording = true;
    this.actions = [];
    this.name = name || useI18n.getState().t("macro.unnamed");
  }

  stop(): Macro | null {
    if (!this.isRecording) return null;
    this.isRecording = false;
    if (this.actions.length === 0) return null;

    return {
      id: `macro-${Date.now()}`,
      name: this.name,
      actions: [...this.actions],
      enabled: true,
    };
  }

  cancel(): void {
    this.isRecording = false;
    this.actions = [];
    this.name = "";
  }

  record(action: MacroAction): void {
    if (this.isRecording) {
      this.actions.push(action);
    }
  }

  recording(): boolean {
    return this.isRecording;
  }

  getActions(): MacroAction[] {
    return [...this.actions];
  }
}

export function replayMacro(
  editor: Monaco.editor.ICodeEditor,
  macro: Macro
): void {
  for (const action of macro.actions) {
    switch (action.type) {
      case "insert": {
        const payload = action.payload as { text: string };
        editor.trigger("macro", "type", { text: payload.text });
        break;
      }
      case "delete": {
        editor.trigger("macro", "deleteRight", null);
        break;
      }
      case "replace": {
        const payload = action.payload as { text: string };
        const selection = editor.getSelection();
        if (selection) {
          editor.executeEdits("macro", [
            {
              range: selection,
              text: payload.text,
            },
          ]);
        }
        break;
      }
      case "cursor": {
        const payload = action.payload as { line: number; column: number };
        editor.setPosition({
          lineNumber: payload.line,
          column: payload.column,
        });
        break;
      }
      case "command": {
        const payload = action.payload as { id: string };
        editor.trigger("macro", payload.id, null);
        break;
      }
    }
  }
}

export const macroRecorder = new MacroRecorder();

declare global {
  interface Window {
    monaco: typeof import("monaco-editor");
  }
}
