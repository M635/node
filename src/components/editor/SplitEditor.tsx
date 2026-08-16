import { useState, useRef, useCallback, type CSSProperties } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { useSettingStore } from "../../stores/settingStore";
import { useEditorStore } from "../../stores/editorStore";
import { useI18n } from "../../stores/i18nStore";
import { defineThemes, getThemeName } from "../../services/monaco/themes";
import { configureLanguages, getLanguageFromPath } from "../../services/monaco/languages";

interface SplitEditorProps {
  content: string;
  path: string;
  language?: string;
  orientation: "horizontal" | "vertical";
  onContentChange?: (value: string) => void;
  onClose: () => void;
}

export function SplitEditor({
  content,
  path,
  language,
  orientation,
  onContentChange,
  onClose,
}: SplitEditorProps) {
  const editor1Ref = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const editor2Ref = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [syncScroll, setSyncScroll] = useState(true);
  const { isDark } = useEditorStore();
  const { t } = useI18n();
  const { fontSize, fontFamily, wordWrap, showLineNumbers, showMinimap, folding } = useSettingStore();

  const handleMount1: OnMount = useCallback((editor, monaco) => {
    editor1Ref.current = editor;
    defineThemes(monaco);
    configureLanguages(monaco);

    editor.onDidScrollChange(() => {
      if (!syncScroll || !editor2Ref.current) return;
      const scrollTop = editor.getScrollTop();
      editor2Ref.current.setScrollTop(scrollTop);
    });
  }, [syncScroll]);

  const handleMount2: OnMount = useCallback((editor, monaco) => {
    editor2Ref.current = editor;
    defineThemes(monaco);
    configureLanguages(monaco);

    editor.onDidScrollChange(() => {
      if (!syncScroll || !editor1Ref.current) return;
      const scrollTop = editor.getScrollTop();
      editor1Ref.current.setScrollTop(scrollTop);
    });
  }, [syncScroll]);

  const handleChange1: OnChange = useCallback((value) => {
    onContentChange?.(value || "");
    if (editor2Ref.current) {
      editor2Ref.current.setValue(value || "");
    }
  }, [onContentChange]);

  const resolvedLanguage = language || getLanguageFromPath(path);

  const options: Monaco.editor.IStandaloneEditorConstructionOptions = {
    fontSize, fontFamily,
    lineHeight: Math.round(fontSize * 1.4),
    wordWrap: wordWrap ? "on" : "off",
    lineNumbers: showLineNumbers ? "on" : "off",
    minimap: { enabled: showMinimap },
    folding,
    bracketPairColorization: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    glyphMargin: true,
    contextmenu: true,
  };

  const containerStyle: CSSProperties = orientation === "horizontal"
    ? { display: "flex", flexDirection: "row", height: "100%", width: "100%" }
    : { display: "flex", flexDirection: "column", height: "100%", width: "100%" };

  return (
    <div className="split-editor-container" style={containerStyle}>
      <div className="split-editor-pane" style={{ flex: 1, position: "relative" }}>
        <Editor
          height="100%"
          width="100%"
          language={resolvedLanguage}
          value={content}
          theme={getThemeName(isDark)}
          options={options}
          onMount={handleMount1}
          onChange={handleChange1}
        />
      </div>
      <div className="split-divider" style={orientation === "horizontal" ? { width: "4px", cursor: "col-resize", background: isDark ? "#333" : "#ccc" } : { height: "4px", cursor: "row-resize", background: isDark ? "#333" : "#ccc" }} />
      <div className="split-editor-pane" style={{ flex: 1, position: "relative" }}>
        <div className="split-editor-toolbar">
          <label className="sync-scroll-toggle">
            <input type="checkbox" checked={syncScroll} onChange={(e) => setSyncScroll(e.target.checked)} />
            {t("split.syncScroll")}
          </label>
          <button className="btn btn-small" onClick={onClose}>{t("split.closeSplit")}</button>
        </div>
        <Editor
          height="100%"
          width="100%"
          language={resolvedLanguage}
          value={content}
          theme={getThemeName(isDark)}
          options={{ ...options, readOnly: true }}
          onMount={handleMount2}
        />
      </div>
    </div>
  );
}
