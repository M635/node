import { useEditorStore } from "../../stores/editorStore";

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

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${isRecordingMacro ? "active" : ""}`}
          onClick={onToggleMacro}
          title="宏录制 (Cmd+M)"
        >
          {isRecordingMacro ? "⏹ 停止录制" : "● 录制宏"}
        </button>
        <button
          className="toolbar-btn"
          onClick={onToggleDiff}
          title="双文件对比 (Cmd+Alt+D)"
        >
          对比
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => onExport("txt")} title="导出 TXT">
          导出 TXT
        </button>
        <button className="toolbar-btn" onClick={() => onExport("html")} title="导出 HTML">
          导出 HTML
        </button>
        <button className="toolbar-btn" onClick={() => onExport("rtf")} title="导出 RTF">
          导出 RTF
        </button>
      </div>
      <div className="toolbar-info">
        <span className="info-item">Tab: {config.tabSize}</span>
        <span className="info-item">
          {config.insertSpaces ? "空格" : "制表符"}
        </span>
      </div>
    </div>
  );
}
