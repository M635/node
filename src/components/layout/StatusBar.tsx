import { useState, useEffect, useRef } from "react";
import type { FileTab } from "../../types/file";
import { formatFileSize } from "../../utils/fileUtils";
import { getEncodingDisplayName } from "../../utils/encodingUtils";
import { useEditorStore } from "../../stores/editorStore";
import { useSettingStore } from "../../stores/settingStore";
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
  selectionInfo: { chars: number; lines: number; words: number; matchCount: number } | null;
}

export function StatusBar({
  activeTab, onSave, onOpenFile, onGotoLine, onExport, onOpenEncoding, onOpenSettings, selectionInfo,
}: StatusBarProps) {
  const { isRecordingMacro, startMacroRecording, stopMacroRecording } = useEditorStore();
  const { fontSize, tabSize, insertSpaces, setTabSize, setInsertSpaces, wordWrap, setWordWrap } = useSettingStore();
  const { t } = useI18n();
  // 插入/覆盖模式用布尔值表示，展示文案由语言包决定
  const [overwrite, setOverwrite] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showTabMenu, setShowTabMenu] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Insert") {
        setOverwrite((m) => !m);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!activeTab?.content) {
      setCharCount(0);
      setWordCount(0);
      return;
    }
    const content = activeTab.content;
    setCharCount(content.length);
    const timer = setTimeout(() => {
      const words = content.trim().split(/\s+/).filter((w) => w.length > 0);
      setWordCount(words.length);
    }, 300);
    return () => clearTimeout(timer);
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
          <span className="status-version" title={t("statusbar.versionTitle", { version: __APP_VERSION__ })}>v{__APP_VERSION__}</span>
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
        <span className="status-item" onClick={onGotoLine} title={t("statusbar.lineTitle")}>
          {t("statusbar.line")} {cursor_position.line}, {t("statusbar.column")} {cursor_position.column}
        </span>
        {selectionInfo && (
          <span className="status-item" title={t("statusbar.selectionTitle")}>
            {t("status.selected")} {selectionInfo.chars} {t("status.chars")}, {selectionInfo.words} {t("status.words")}, {selectionInfo.lines} {t("statusbar.line")}
            {selectionInfo.matchCount > 1 && ` (${selectionInfo.matchCount} ${t("editor.match")})`}
          </span>
        )}
        <span className="status-item" title={t("statusbar.wordCharTitle", { words: wordCount, chars: charCount })}>
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
          {overwrite ? t("status.overwrite") : t("status.insert")}
        </span>
        <span
          className={`status-item clickable ${wordWrap ? "active" : ""}`}
          onClick={() => setWordWrap(!wordWrap)}
          title={t("toolbar.wordWrap")}
        >
          {wordWrap ? "↩" : "→"}
        </span>
      </div>
      <div className="status-right">
        <span className="status-item encoding-badge" onClick={onOpenEncoding} title={t("statusbar.encoding")}>
          {getEncodingDisplayName(encoding)}
        </span>
        <span className="status-item" title={t("statusbar.eol")}>
          {meta?.line_ending === "Crlf" ? "CRLF" : meta?.line_ending === "Mixed" ? t("status.mixed") : "LF"}
        </span>
        <span className="status-item tab-size-indicator" onClick={() => setShowTabMenu((v) => !v)} title={t("toolbar.tabWidth", { n: tabSize })}>
          {insertSpaces ? t("toolbar.spaces") : t("toolbar.tabs")}: {tabSize}
          {showTabMenu && (
            <div className="tab-size-menu" onClick={(e) => e.stopPropagation()}>
              {[2, 4, 8].map((size) => (
                <div
                  key={size}
                  className={`tab-size-option ${tabSize === size ? "active" : ""}`}
                  onClick={() => { setTabSize(size); setShowTabMenu(false); }}
                >
                  {size}
                </div>
              ))}
              <div className="tab-size-divider" />
              <div
                className={`tab-size-option ${insertSpaces ? "active" : ""}`}
                onClick={() => { setInsertSpaces(true); setShowTabMenu(false); }}
              >
                {t("toolbar.spaces")}
              </div>
              <div
                className={`tab-size-option ${!insertSpaces ? "active" : ""}`}
                onClick={() => { setInsertSpaces(false); setShowTabMenu(false); }}
              >
                {t("toolbar.tabs")}
              </div>
            </div>
          )}
        </span>
        {fontSize !== 14 && (
          <span className="status-item" title={t("statusbar.zoom")}>
            {Math.round(fontSize / 14 * 100)}%
          </span>
        )}
        <span className="status-item" onClick={onOpenSettings} title={t("statusbar.settings")}>⚙</span>
        <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
        <span className="status-version" title={t("statusbar.versionTitle", { version: __APP_VERSION__ })}>v{__APP_VERSION__}</span>
      </div>
    </div>
  );
}
