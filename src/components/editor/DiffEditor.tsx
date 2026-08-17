import { useState, useCallback, useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";
import type { editor as MonacoEditorNS } from "monaco-editor";
import { useEditorStore } from "../../stores/editorStore";
import { getThemeName } from "../../services/monaco/themes";
import { useSettingStore } from "../../stores/settingStore";
import { useI18n } from "../../stores/i18nStore";

interface DiffEditorViewProps {
  original: string;
  modified: string;
  language?: string;
}

export function DiffEditorView({
  original,
  modified,
  language = "plaintext",
}: DiffEditorViewProps) {
  const { isDark } = useEditorStore();
  const { fontSize, fontFamily, showLineNumbers } = useSettingStore();
  const { t } = useI18n();
  const diffEditorRef = useRef<MonacoEditorNS.IDiffEditor | null>(null);
  const [diffLineChanges, setDiffLineChanges] = useState<number[]>([]);
  const [currentDiffIdx, setCurrentDiffIdx] = useState(-1);

  const handleMount = useCallback((editor: MonacoEditorNS.IDiffEditor) => {
    diffEditorRef.current = editor;
    setTimeout(() => collectDiffLines(), 200);
  }, []);

  const collectDiffLines = useCallback(() => {
    const editor = diffEditorRef.current;
    if (!editor) return;
    const modifiedModel = editor.getModifiedEditor().getModel();
    const originalModel = editor.getOriginalEditor().getModel();
    if (!modifiedModel || !originalModel) return;
    const changes: number[] = [];
    const modifiedLines = modifiedModel.getLinesContent();
    const originalLines = originalModel.getLinesContent();
    const maxLines = Math.max(modifiedLines.length, originalLines.length);
    for (let i = 0; i < maxLines; i++) {
      if (modifiedLines[i] !== originalLines[i]) {
        changes.push(i + 1);
      }
    }
    setDiffLineChanges(changes);
    setCurrentDiffIdx(-1);
  }, []);

  const goToNextDiff = useCallback(() => {
    if (diffLineChanges.length === 0) return;
    const editor = diffEditorRef.current;
    if (!editor) return;
    const modified = editor.getModifiedEditor();
    const currentLine = modified.getPosition()?.lineNumber ?? 1;
    let nextIdx = diffLineChanges.findIndex((l) => l > currentLine);
    if (nextIdx === -1) nextIdx = 0;
    setCurrentDiffIdx(nextIdx);
    modified.revealLineInCenter(diffLineChanges[nextIdx]);
    modified.setPosition({ lineNumber: diffLineChanges[nextIdx], column: 1 });
  }, [diffLineChanges]);

  const goToPrevDiff = useCallback(() => {
    if (diffLineChanges.length === 0) return;
    const editor = diffEditorRef.current;
    if (!editor) return;
    const modified = editor.getModifiedEditor();
    const currentLine = modified.getPosition()?.lineNumber ?? 1;
    let prevIdx = -1;
    for (let i = diffLineChanges.length - 1; i >= 0; i--) {
      if (diffLineChanges[i] < currentLine) {
        prevIdx = i;
        break;
      }
    }
    if (prevIdx === -1) prevIdx = diffLineChanges.length - 1;
    setCurrentDiffIdx(prevIdx);
    modified.revealLineInCenter(diffLineChanges[prevIdx]);
    modified.setPosition({ lineNumber: diffLineChanges[prevIdx], column: 1 });
  }, [diffLineChanges]);

  return (
    <div className="diff-editor-wrapper">
      <div className="diff-toolbar">
        <button className="diff-nav-btn" onClick={goToPrevDiff} title={t("diff.prevChange")}>
          ↑ {t("diff.prevChange")}
        </button>
        <span className="diff-info">
          {diffLineChanges.length > 0
            ? `${currentDiffIdx >= 0 ? currentDiffIdx + 1 : 0}/${diffLineChanges.length}`
            : t("diff.noChanges")}
        </span>
        <button className="diff-nav-btn" onClick={goToNextDiff} title={t("diff.nextChange")}>
          ↓ {t("diff.nextChange")}
        </button>
      </div>
      <DiffEditor
        height="calc(100% - 36px)"
        width="100%"
        original={original}
        modified={modified}
        language={language}
        theme={getThemeName(isDark)}
        onMount={handleMount}
        options={{
          readOnly: true,
          fontSize,
          fontFamily,
          lineNumbers: showLineNumbers ? "on" : "off",
          renderWhitespace: "boundary",
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          diffWordWrap: "on",
          originalEditable: false,
          renderIndicators: true,
          maxComputationTime: 5000,
          contextmenu: false,
        }}
      />
    </div>
  );
}
