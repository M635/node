import type * as Monaco from "monaco-editor";

export class EditOperations {
  static deleteCurrentLine(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco): void {
    const position = editor.getPosition();
    const model = editor.getModel();
    if (!position || !model) return;
    const lineCount = model.getLineCount();
    const range = position.lineNumber < lineCount
      ? new monaco.Range(position.lineNumber, 1, position.lineNumber + 1, 1)
      : new monaco.Range(position.lineNumber - 1, model.getLineContent(position.lineNumber - 1).length + 1, position.lineNumber, model.getLineContent(position.lineNumber).length + 1);
    editor.executeEdits("delete-line", [{ range, text: "" }]);
  }

  static duplicateCurrentLine(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const position = editor.getPosition();
    const model = editor.getModel();
    if (!position || !model) return;
    const lineContent = model.getLineContent(position.lineNumber);
    editor.executeEdits("duplicate-line", [{
      range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: 1 } as any,
      text: lineContent + "\n",
    }]);
  }

  static moveLineUp(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const position = editor.getPosition();
    const model = editor.getModel();
    if (!position || !model || position.lineNumber <= 1) return;
    const currentLine = model.getLineContent(position.lineNumber);
    const prevLine = model.getLineContent(position.lineNumber - 1);
    editor.executeEdits("move-up", [{
      range: { startLineNumber: position.lineNumber - 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: currentLine.length + 1 } as any,
      text: currentLine + "\n" + prevLine,
    }]);
    editor.setPosition({ lineNumber: position.lineNumber - 1, column: position.column });
  }

  static moveLineDown(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const position = editor.getPosition();
    const model = editor.getModel();
    if (!position || !model || position.lineNumber >= model.getLineCount()) return;
    const currentLine = model.getLineContent(position.lineNumber);
    const nextLine = model.getLineContent(position.lineNumber + 1);
    editor.executeEdits("move-down", [{
      range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber + 1, endColumn: nextLine.length + 1 } as any,
      text: nextLine + "\n" + currentLine,
    }]);
    editor.setPosition({ lineNumber: position.lineNumber + 1, column: position.column });
  }

  static deleteBlankLines(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValue();
    const lines = text.split("\n");
    const filtered = lines.filter((line, i) => !(line.trim() === "" && (i === 0 || lines[i - 1].trim() === "")));
    model.setValue(filtered.join("\n"));
  }

  static trimTrailingWhitespace(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValue();
    const lines = text.split("\n").map((line) => line.replace(/\s+$/, ""));
    model.setValue(lines.join("\n"));
  }

  static trimLeadingWhitespace(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValue();
    const lines = text.split("\n").map((line) => line.replace(/^\s+/, ""));
    model.setValue(lines.join("\n"));
  }

  static toUpperCase(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;
    if (selection.isEmpty()) { model.setValue(model.getValue().toUpperCase()); return; }
    const text = model.getValueInRange(selection);
    editor.executeEdits("upper", [{ range: selection as any, text: text.toUpperCase() }]);
  }

  static toLowerCase(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;
    if (selection.isEmpty()) { model.setValue(model.getValue().toLowerCase()); return; }
    const text = model.getValueInRange(selection);
    editor.executeEdits("lower", [{ range: selection as any, text: text.toLowerCase() }]);
  }

  static toTitleCase(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;
    const text = model.getValueInRange(selection);
    const converted = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    editor.executeEdits("title", [{ range: selection as any, text: converted }]);
  }

  static invertCase(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;
    const text = model.getValueInRange(selection);
    const inverted = text.split("").map((c) =>
      c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
    ).join("");
    editor.executeEdits("invert", [{ range: selection as any, text: inverted }]);
  }

  static sortLinesAscending(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.sortLines(editor, false);
  }

  static sortLinesDescending(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.sortLines(editor, true);
  }

  private static sortLines(editor: Monaco.editor.IStandaloneCodeEditor, descending: boolean): void {
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;
    const startLine = Math.min(selection.startLineNumber, selection.endLineNumber);
    const endLine = Math.max(selection.startLineNumber, selection.endLineNumber);
    if (startLine === endLine) return;

    const lines: string[] = [];
    for (let i = startLine; i <= endLine; i++) {
      lines.push(model.getLineContent(i));
    }
    lines.sort((a, b) => {
      const result = a.localeCompare(b, undefined, { numeric: true });
      return descending ? -result : result;
    });

    editor.executeEdits("sort", [{
      range: { startLineNumber: startLine, startColumn: 1, endLineNumber: endLine, endColumn: model.getLineContent(endLine).length + 1 } as any,
      text: lines.join("\n"),
    }]);
  }

  static toggleLineComment(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco): void {
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;
    const language = model.getLanguageId();
    const commentToken = getLineCommentToken(language);

    const startLine = Math.min(selection.startLineNumber, selection.endLineNumber);
    const endLine = Math.max(selection.startLineNumber, selection.endLineNumber);

    let allCommented = true;
    for (let i = startLine; i <= endLine; i++) {
      const line = model.getLineContent(i);
      if (!line.trimStart().startsWith(commentToken)) { allCommented = false; break; }
    }

    const edits: Monaco.editor.IIdentifySingleEditOperation[] = [];
    for (let i = startLine; i <= endLine; i++) {
      const line = model.getLineContent(i);
      if (allCommented) {
        const idx = line.indexOf(commentToken);
        const newText = line.slice(0, idx) + line.slice(idx + commentToken.length).replace(/^\s/, "");
        edits.push({ range: new monaco.Range(i, 1, i, line.length + 1), text: newText });
      } else {
        edits.push({ range: new monaco.Range(i, 1, i, 1), text: commentToken + " " });
      }
    }
    editor.executeEdits("comment", edits);
  }

  static indent(editor: Monaco.editor.IStandaloneCodeEditor): void {
    editor.trigger("indent", "editor.action.indentLines", null);
  }

  static outdent(editor: Monaco.editor.IStandaloneCodeEditor): void {
    editor.trigger("outdent", "editor.action.outdentLines", null);
  }

  static removeDuplicateLines(editor: Monaco.editor.IStandaloneCodeEditor): void {
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValue();
    const lines = text.split("\n");
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      if (!seen.has(line)) { seen.add(line); result.push(line); }
    }
    model.setValue(result.join("\n"));
  }

  static getWordCount(editor: Monaco.editor.IStandaloneCodeEditor): { chars: number; words: number; lines: number; selected: number } {
    const model = editor.getModel();
    if (!model) return { chars: 0, words: 0, lines: 0, selected: 0 };
    const text = model.getValue();
    const chars = text.length;
    const words = (text.match(/\S+/g) || []).length;
    const lines = model.getLineCount();
    const selection = editor.getSelection();
    const selected = selection && !selection.isEmpty() ? model.getValueInRange(selection).length : 0;
    return { chars, words, lines, selected };
  }
}

function getLineCommentToken(language: string): string {
  const tokens: Record<string, string> = {
    javascript: "//", typescript: "//", java: "//", c: "//", cpp: "//",
    csharp: "//", go: "//", rust: "//", swift: "//", kotlin: "//",
    scala: "//", dart: "//", php: "//", css: "/*", scss: "//",
    python: "#", ruby: "#", shell: "#", yaml: "#", dockerfile: "#",
    makefile: "#", perl: "#", r: "#", powershell: "#",
    html: "<!--", xml: "<!--", markdown: "<!--", sql: "--",
    lua: "--", vim: '"', plaintext: "#",
  };
  return tokens[language] || "//";
}
