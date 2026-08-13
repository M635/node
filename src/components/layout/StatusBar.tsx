import { useState, useEffect } from "react";
import type { FileTab } from "../../types/file";
import { formatFileSize } from "../../utils/fileUtils";
import { getEncodingDisplayName } from "../../utils/encodingUtils";
import { useEditorStore } from "../../stores/editorStore";
import { useI18n } from "../../stores/i18nStore";
import { EditorToolbar } from "../editor/EditorToolbar";

interface StatusBarProps {
  activeTab: FileTab | null;
  onSave: () => void;
  onOpenFile: () => void;
  onGotoLine: () => void;
  onExport: (format: "txt" | "html" | "rtf") => void;
  onOpenEncoding: () => void;
  onOpenSettings: () => void;
  selectionInfo: { chars: number; lines: number } | null;
}

export function StatusBar({
  activeTab, onSave, onOpenFile, onGotoLine, onExport, onOpenEncoding, onOpenSettings, selectionInfo,
}: StatusBarProps) {
  const { isRecordingMacro, startMacroRecording, stopMacroRecording } = useEditorStore();
  const { t } = useI18n();
  const [insertMode, setInsertMode] = useState<"插入" | "覆盖">("插入");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Insert") {
        setInsertMode((m) => (m === "插入" ? "覆盖" : "插入"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (activeTab?.content) {
      const content = activeTab.content;
      setCharCount(content.length);
      const words = content.trim().split(/\s+/).filter((w) => w.length > 0);
      setWordCount(words.length);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [activeTab?.content]);

  const handleToggleMacro = () => {
    if (isRecordingMacro) stopMacroRecording();
    else startMacroRecording();
  };

  const handleToggleDiff = () => {
    window.dispatchEvent(new CustomEvent("markpt:toggle-diff"));
  };

  if (!activeTab) {
    return (
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item" onClick={onOpenFile}>{t("statusbar.openFile")}</span>
          <span className="status-item" onClick={onOpenSettings}>{t("statusbar.settings")}</span>
        </div>
        <div className="status-right">
          <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
          <span className="status-version" title="MarkPT v2.0.0">v2.0.0</span>
        </div>
      </div>
    );
  }

  const { cursor_position, meta, encoding, language, is_dirty, readonly } = activeTab;

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item" onClick={onSave} title={t("common.save")}>
          {is_dirty ? t("status.modified") : t("status.saved")}
        </span>
        <span className="status-item" title={t("statusbar.language")}>{language}</span>
        <span className="status-item" onClick={onGotoLine} title="跳转行号">
          {t("statusbar.line")} {cursor_position.line}, {t("statusbar.column")} {cursor_position.column}
        </span>
        {selectionInfo && (
          <span className="status-item" title="选中信息">
            {t("status.selected")} {selectionInfo.chars} {t("status.chars")}, {selectionInfo.lines} {t("statusbar.line")}
          </span>
        )}
        <span className="status-item" title={`字数: ${wordCount}, 字符数: ${charCount}`}>
          {wordCount} {t("status.words")} / {charCount} {t("status.chars")}
        </span>
        {meta && (
          <>
            <span className="status-item">{formatFileSize(meta.size)}</span>
            <span className="status-item">{meta.line_count} {t("statusbar.line")}</span>
          </>
        )}
        {readonly && <span className="status-item readonly-badge">{t("status.readonly")}</span>}
        <span className="status-item" title={t("statusbar.insertMode")}>
          {insertMode === "插入" ? t("status.insert") : t("status.overwrite")}
        </span>
      </div>
      <div className="status-right">
        <span className="status-item encoding-badge" onClick={onOpenEncoding} title={t("statusbar.encoding")}>
          {getEncodingDisplayName(encoding)}
        </span>
        <span className="status-item" title={t("statusbar.eol")}>
          {meta?.line_ending === "Crlf" ? "CRLF" : meta?.line_ending === "Mixed" ? "混合" : "LF"}
        </span>
        <span className="status-item" onClick={onOpenSettings} title={t("statusbar.settings")}>⚙</span>
        <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
        <span className="status-version" title="MarkPT v2.0.0">v2.0.0</span>
      </div>
    </div>
  );
}
