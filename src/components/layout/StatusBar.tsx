import type { FileTab } from "../../types/file";
import { formatFileSize } from "../../utils/fileUtils";
import { getEncodingDisplayName } from "../../utils/encodingUtils";
import { useEditorStore } from "../../stores/editorStore";
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
          <span className="status-item" onClick={onOpenFile}>打开文件</span>
          <span className="status-item" onClick={onOpenSettings}>设置</span>
        </div>
        <div className="status-right">
          <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
        </div>
      </div>
    );
  }

  const { cursor_position, meta, encoding, language, is_dirty, readonly } = activeTab;

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item" onClick={onSave} title="保存">
          {is_dirty ? "● 已修改" : "✓ 已保存"}
        </span>
        <span className="status-item">{language}</span>
        <span className="status-item" onClick={onGotoLine} title="跳转行号">
          行 {cursor_position.line}, 列 {cursor_position.column}
        </span>
        {selectionInfo && (
          <span className="status-item" title="选中信息">
            已选 {selectionInfo.chars} 字符, {selectionInfo.lines} 行
          </span>
        )}
        {meta && (
          <>
            <span className="status-item">{formatFileSize(meta.size)}</span>
            <span className="status-item">{meta.line_count} 行</span>
          </>
        )}
        {readonly && <span className="status-item readonly-badge">只读</span>}
      </div>
      <div className="status-right">
        <span className="status-item encoding-badge" onClick={onOpenEncoding} title="点击切换编码">
          {getEncodingDisplayName(encoding)}
        </span>
        <span className="status-item">
          {meta?.line_ending === "Crlf" ? "CRLF" : "LF"}
        </span>
        <span className="status-item" onClick={onOpenSettings} title="设置">⚙</span>
        <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
      </div>
    </div>
  );
}
