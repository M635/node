import { useEditorStore } from "../../stores/editorStore";
import { useI18n } from "../../stores/i18nStore";

interface EditorToolbarProps {
  isRecordingMacro: boolean;
  onToggleMacro: () => void;
  onToggleDiff: () => void;
  onExport: (format: "txt" | "html" | "rtf") => void;
}

export function EditorToolbar({
  isRecordingMacro,
  onToggleMacro,
  onToggleDiff,
  onExport,
}: EditorToolbarProps) {
  const { config } = useEditorStore();
  const { t } = useI18n();

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${isRecordingMacro ? "active" : ""}`}
          onClick={onToggleMacro}
          title={t("toolbar.macroRecord")}
        >
          {isRecordingMacro ? t("toolbar.stopRecord") : t("toolbar.recordMacro")}
        </button>
        <button
          className="toolbar-btn"
          onClick={onToggleDiff}
          title={t("toolbar.compareTitle")}
        >
          {t("toolbar.compareBtn")}
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => onExport("txt")} title={t("toolbar.exportTxt")}>
          {t("toolbar.exportTxt")}
        </button>
        <button className="toolbar-btn" onClick={() => onExport("html")} title={t("toolbar.exportHtml")}>
          {t("toolbar.exportHtml")}
        </button>
        <button className="toolbar-btn" onClick={() => onExport("rtf")} title={t("toolbar.exportRtf")}>
          {t("toolbar.exportRtf")}
        </button>
      </div>
      <div className="toolbar-info">
        <span className="info-item">{t("toolbar.tabWidth", { n: config.tabSize })}</span>
        <span className="info-item">
          {config.insertSpaces ? t("toolbar.spaces") : t("toolbar.tabs")}
        </span>
      </div>
    </div>
  );
}
