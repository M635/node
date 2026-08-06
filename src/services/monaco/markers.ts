import type * as Monaco from "monaco-editor";

const BOOKMARK_DECORATION_ID = "macpad-bookmark";

export function createBookmarkDecoration(
  monaco: typeof Monaco,
  isDark: boolean
): Monaco.editor.IModelDecorationOptions {
  return {
    glyphMarginClassName: "macpad-bookmark-glyph",
    glyphMarginHoverMessage: { value: "书签" },
    stickiness: 1,
    linesDecorationsClassName: "",
    overviewRuler: {
      color: isDark ? "#0a84ff" : "#007aff",
      position: monaco.editor.OverviewRulerLane.Right,
    },
  };
}

export function updateBookmarkDecorations(
  editor: Monaco.editor.IStandaloneCodeEditor,
  bookmarks: number[]
): string[] {
  const model = editor.getModel();
  if (!model) return [];

  const decorations = bookmarks.map((line) => ({
    range: new (editor.getModel()!.getFullModelRange().constructor as any)(
      line,
      1,
      line,
      1
    ),
    options: {
      isWholeLine: true,
      glyphMarginClassName: "macpad-bookmark-glyph",
      glyphMarginHoverMessage: { value: "书签" },
      stickiness: 1,
    },
  }));

  return editor.deltaDecorations([], decorations);
}

export function getDecorationId(): string {
  return BOOKMARK_DECORATION_ID;
}
