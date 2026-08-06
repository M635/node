import type * as Monaco from "monaco-editor";

export function configureFolding(monaco: typeof Monaco): void {
  monaco.languages.registerFoldingRangeProvider("plaintext", {
    provideFoldingRanges: (model) => {
      const ranges: Monaco.languages.FoldingRange[] = [];
      const lineCount = model.getLineCount();

      let indentStack: { indent: number; line: number }[] = [];

      for (let i = 1; i <= lineCount; i++) {
        const line = model.getLineContent(i);
        const indent = getIndentLevel(line);

        while (
          indentStack.length > 0 &&
          indentStack[indentStack.length - 1].indent >= indent
        ) {
          const top = indentStack.pop()!;
          if (i - top.line > 1) {
            ranges.push({
              start: top.line,
              end: i - 1,
              kind: monaco.languages.FoldingRangeKind.Region,
            });
          }
        }

        if (line.trim().endsWith("{") || line.trim().endsWith("[")) {
          indentStack.push({ indent: indent + 1, line: i });
        }
      }

      while (indentStack.length > 0) {
        const top = indentStack.pop()!;
        if (lineCount - top.line > 1) {
          ranges.push({
            start: top.line,
            end: lineCount,
            kind: monaco.languages.FoldingRangeKind.Region,
          });
        }
      }

      return ranges;
    },
  });
}

function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  if (!match) return 0;
  const whitespace = match[1];
  let level = 0;
  for (const ch of whitespace) {
    level += ch === "\t" ? 4 : 1;
  }
  return level;
}

export function enableBracketPairColorization(
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor
): void {
  editor.updateOptions({
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },
  });
}
