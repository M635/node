import { useEditorStore } from "../../stores/editorStore";
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

  const handleToggleRecord = () => {
    if (isRecordingMacro) {
      const macro = macroRecorder.stop();
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
          <h2>宏管理</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="macro-controls">
            <button
              className={`macro-btn ${isRecordingMacro ? "recording" : ""}`}
              onClick={handleToggleRecord}
            >
              {isRecordingMacro ? "⏹ 停止录制" : "● 开始录制"}
            </button>
          </div>
          <div className="macro-list">
            {macros.length === 0 ? (
              <div className="macro-empty">暂无宏</div>
            ) : (
              macros.map((macro) => (
                <div key={macro.id} className="macro-item">
                  <span className="macro-name">{macro.name}</span>
                  <span className="macro-actions-count">
                    {macro.actions.length} 步
                  </span>
                  <button
                    className="macro-play"
                    onClick={() => handlePlay(macro.id)}
                    title="回放"
                  >
                    ▶
                  </button>
                  <button
                    className="macro-delete"
                    onClick={() => handleDelete(macro.id)}
                    title="删除"
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
