import { useEffect, useRef, useCallback } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { useEditorStore } from "../../stores/editorStore";
import { useSettingStore } from "../../stores/settingStore";
import { useSearchStore } from "../../stores/searchStore";
import { defineThemes, getThemeName } from "../../services/monaco/themes";
import { configureLanguages, getLanguageFromPath } from "../../services/monaco/languages";
import { configureFolding } from "../../services/monaco/folding";
import { registerKeybindings } from "../../services/monaco/keybindings";
import { macroRecorder } from "../../services/macro/recorder";

interface MonacoEditorProps {
  tabId: string;
  path: string;
  content: string;
  language?: string;
  readonly?: boolean;
  onContentChange?: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
}

export function MonacoEditor({
  tabId,
  path,
  content,
  language,
  readonly = false,
  onContentChange,
  onCursorChange,
}: MonacoEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const decorationIdsRef = useRef<string[]>([]);
  const { isDark, getBookmarks } = useEditorStore();
  const {
    fontSize, fontFamily, tabSize, insertSpaces, wordWrap,
    showLineNumbers, showWhitespace, showMinimap, folding,
    bracketPairColorization, autoIndent,
  } = useSettingStore();
  const { searchQuery, replaceQuery, isRegex, caseSensitive } = useSearchStore();

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    window.monaco = monaco;

    defineThemes(monaco);
    configureLanguages(monaco);
    configureFolding(monaco);
    registerKeybindings(monaco, editor);

    editor.onDidChangeCursorPosition((e) => {
      onCursorChange?.(e.position.lineNumber, e.position.column);
    });

    editor.onDidChangeModelContent(() => {
      if (macroRecorder.recording()) {
        macroRecorder.record({ type: "command", payload: { id: "type" } });
      }
    });

    editor.onMouseDown((e) => {
      if (e.target.type === Monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const line = e.target.position?.lineNumber;
        if (line) {
          useEditorStore.getState().toggleBookmark(tabId, line);
        }
      }
    });
  }, [onCursorChange, tabId]);

  // 行号跳转
  useEffect(() => {
    const handler = (e: Event) => {
      const line = (e as CustomEvent).detail?.line;
      if (editorRef.current && line) {
        editorRef.current.revealLineInCenter(line);
        editorRef.current.setPosition({ lineNumber: line, column: 1 });
        editorRef.current.focus();
      }
    };
    window.addEventListener("macpad:goto-line-confirm", handler);
    return () => window.removeEventListener("macpad:goto-line-confirm", handler);
  }, []);

  // 查找替换
  useEffect(() => {
    const replaceHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!editorRef.current || !monacoRef.current || !detail) return;
      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      const flags = detail.caseSensitive ? "g" : "gi";
      let regex: RegExp;
      try {
        regex = detail.isRegex
          ? new RegExp(detail.search, flags)
          : new RegExp(detail.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      } catch {
        return;
      }

      const selection = editor.getSelection();
      if (!selection) return;

      const lineContent = model.getLineContent(selection.startLineNumber);
      const match = regex.exec(lineContent);
      if (match && match.index !== undefined) {
        const startCol = match.index + 1;
        const endCol = match.index + match[0].length + 1;
        editor.setSelection(new monacoRef.current.Range(
          selection.startLineNumber, startCol,
          selection.startLineNumber, endCol
        ));
        editor.executeEdits("replace", [{
          range: new monacoRef.current.Range(
            selection.startLineNumber, startCol,
            selection.startLineNumber, endCol
          ),
          text: detail.replace,
        }]);
      }
    };

    const replaceAllHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!editorRef.current || !monacoRef.current || !detail) return;
      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      const flags = detail.caseSensitive ? "g" : "gi";
      let regex: RegExp;
      try {
        regex = detail.isRegex
          ? new RegExp(detail.search, flags)
          : new RegExp(detail.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      } catch {
        return;
      }

      const fullText = model.getValue();
      const newText = fullText.replace(regex, detail.replace);
      model.setValue(newText);
    };

    window.addEventListener("macpad:execute-replace", replaceHandler);
    window.addEventListener("macpad:execute-replace-all", replaceAllHandler);
    return () => {
      window.removeEventListener("macpad:execute-replace", replaceHandler);
      window.removeEventListener("macpad:execute-replace-all", replaceAllHandler);
    };
  }, []);

  // 书签装饰
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const bookmarks = getBookmarks(tabId);
    const decorations = bookmarks.map((line) => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        glyphMarginClassName: "macpad-bookmark-glyph",
        glyphMarginHoverMessage: { value: "书签" },
        stickiness: 1,
        overviewRuler: {
          color: isDark ? "#0a84ff" : "#007aff",
          position: monaco.editor.OverviewRulerLane.Right,
        },
      },
    }));

    decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, decorations);
  }, [tabId, getBookmarks, isDark]);

  // 主题切换
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setTheme(getThemeName(isDark));
    }
  }, [isDark]);

  // 搜索高亮
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    if (!searchQuery) {
      monaco.editor.setModelMarkers(editor.getModel()!, "search", []);
      return;
    }

    const model = editor.getModel();
    if (!model) return;

    const flags = caseSensitive ? "g" : "gi";
    let regex: RegExp;
    try {
      regex = isRegex
        ? new RegExp(searchQuery, flags)
        : new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    } catch {
      return;
    }

    const matches: Monaco.editor.IMarkerData[] = [];
    const lineCount = model.getLineCount();
    for (let i = 1; i <= lineCount && matches.length < 1000; i++) {
      const line = model.getLineContent(i);
      let match;
      while ((match = regex.exec(line)) !== null && matches.length < 1000) {
        matches.push({
          startLineNumber: i,
          startColumn: match.index + 1,
          endLineNumber: i,
          endColumn: match.index + match[0].length + 1,
          message: "匹配",
          severity: monaco.MarkerSeverity.Info,
        });
        if (match.index === regex.lastIndex) regex.lastIndex++;
      }
    }
    monaco.editor.setModelMarkers(model, "search", matches);
  }, [searchQuery, isRegex, caseSensitive]);

  const handleChange: OnChange = useCallback((value) => {
    onContentChange?.(value || "");
  }, [onContentChange]);

  const resolvedLanguage = language || getLanguageFromPath(path);

  const options: Monaco.editor.IStandaloneEditorConstructionOptions = {
    readOnly: readonly,
    fontSize, fontFamily,
    lineHeight: Math.round(fontSize * 1.4),
    tabSize, insertSpaces,
    wordWrap: wordWrap ? "on" : "off",
    lineNumbers: showLineNumbers ? "on" : "off",
    renderWhitespace: showWhitespace ? "all" : "boundary",
    minimap: { enabled: showMinimap },
    folding,
    bracketPairColorization: { enabled: bracketPairColorization },
    guides: { bracketPairs: bracketPairColorization, indentation: true },
    autoIndent: autoIndent ? "advanced" : "none",
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: "on",
    selectOnLineNumbers: true,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    smoothScrolling: true,
    mouseWheelZoom: true,
    multiCursorModifier: "ctrlCmd",
    columnSelection: true,
    linkedEditing: true,
    trimAutoWhitespace: true,
    renderLineHighlight: "all",
    glyphMargin: true,
    fixedOverflowWidgets: true,
    contextmenu: true,
    quickSuggestions: { other: true, comments: false, strings: false },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    tabCompletion: "on",
    wordBasedSuggestions: "allDocuments",
    maxTokenizationLineLength: 20000,
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: "never",
      seedSearchStringFromSelection: "always",
    },
  };

  return (
    <div className="monaco-editor-wrapper" data-tab-id={tabId}>
      <Editor
        height="100%"
        width="100%"
        language={resolvedLanguage}
        value={content}
        theme={getThemeName(isDark)}
        options={options}
        onMount={handleMount}
        onChange={handleChange}
        loading={
          <div className="editor-loading">
            <span>加载编辑器...</span>
          </div>
        }
      />
    </div>
  );
}
