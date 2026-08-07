import { useEffect, useRef, useCallback } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useEditorStore } from "../../stores/editorStore";
import { useSettingStore } from "../../stores/settingStore";
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
  onEditorMount?: (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => void;
}

export function MonacoEditor({
  tabId,
  path,
  content,
  language,
  readonly = false,
  onContentChange,
  onCursorChange,
  onEditorMount,
}: MonacoEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const { isDark, isRecordingMacro } = useEditorStore();
  const {
    fontSize,
    fontFamily,
    tabSize,
    insertSpaces,
    wordWrap,
    showLineNumbers,
    showWhitespace,
    showMinimap,
    folding,
    bracketPairColorization,
    autoIndent,
  } = useSettingStore();

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
        macroRecorder.record({
          type: "command",
          payload: { id: "type" },
        });
      }
    });

    onEditorMount?.(editor, monaco);
  }, [onCursorChange, onEditorMount]);

  const handleChange: OnChange = useCallback((value) => {
    const newContent = value || "";
    onContentChange?.(newContent);
  }, [onContentChange]);

  const resolvedLanguage = language || getLanguageFromPath(path);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const theme = getThemeName(isDark);
      monacoRef.current.editor.setTheme(theme);
    }
  }, [isDark]);

  const options: Monaco.editor.IStandaloneEditorConstructionOptions = {
    readOnly: readonly,
    fontSize,
    fontFamily,
    lineHeight: Math.round(fontSize * 1.4),
    tabSize,
    insertSpaces,
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
    renderIndentGuides: true,
    glyphMargin: true,
    fixedOverflowWidgets: true,
    contextmenu: true,
    quickSuggestions: { other: true, comments: false, strings: false },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    tabCompletion: "on",
    wordBasedSuggestions: "allDocuments",
    semanticHighlighting: { enabled: true },
    maxTokenizationLineLength: 20000,
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
