import { useEditorStore } from "../../stores/editorStore";
import { useI18n } from "../../stores/i18nStore";
import { macroRecorder, replayMacro } from "../../services/macro/recorder";

interface MacroPanelProps {
  onClose: () => void;
}

export function MacroPanel({ onClose }: MacroPanelProps) {
  const {
    macros,
    isRecordingMacro,
    startMacroRecording,
    stopMacroRecording,
    deleteMacro,
    saveMacro,
  } = useEditorStore();
  const { t } = useI18n();

  const handleToggleRecord = () => {
    if (isRecordingMacro) {
      const macro = macroRecorder.stop();
      stopMacroRecording();
      if (macro) {
        saveMacro(macro);
      }
    } else {
      macroRecorder.start();
      startMacroRecording();
    }
  };

  const handlePlay = (macroId: string) => {
    const macro = macros.find((m) => m.id === macroId);
    if (macro && window.monaco) {
      const editors = window.monaco.editor.getEditors();
      if (editors.length > 0) {
        replayMacro(editors[0], macro);
      }
    }
  };

  const handleDelete = (macroId: string) => {
    deleteMacro(macroId);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog macro-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{t("dialog.macroPanel")}</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="macro-controls">
            <button
              className={`macro-btn ${isRecordingMacro ? "recording" : ""}`}
              onClick={handleToggleRecord}
            >
              {isRecordingMacro ? t("toolbar.stopRecord") : t("toolbar.recordMacro")}
            </button>
          </div>
          <div className="macro-list">
            {macros.length === 0 ? (
              <div className="macro-empty">{t("macro.empty")}</div>
            ) : (
              macros.map((macro) => (
                <div key={macro.id} className="macro-item">
                  <span className="macro-name">{macro.name}</span>
                  <span className="macro-actions-count">
                    {t("macro.steps", { n: macro.actions.length })}
                  </span>
                  <button
                    className="macro-play"
                    onClick={() => handlePlay(macro.id)}
                    title={t("macro.replay")}
                  >
                    ▶
                  </button>
                  <button
                    className="macro-delete"
                    onClick={() => handleDelete(macro.id)}
                    title={t("common.delete")}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
