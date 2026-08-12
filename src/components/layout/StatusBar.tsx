import { useState, useEffect } from "react";
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
          <span className="status-item" onClick={onOpenFile}>打开文件</span>
          <span className="status-item" onClick={onOpenSettings}>设置</span>
        </div>
        <div className="status-right">
          <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
          <span className="status-version" title="MarkPT v1.0.3">v1.0.3</span>
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
        <span className="status-item" title="语言">{language}</span>
        <span className="status-item" onClick={onGotoLine} title="跳转行号">
          行 {cursor_position.line}, 列 {cursor_position.column}
        </span>
        {selectionInfo && (
          <span className="status-item" title="选中信息">
            已选 {selectionInfo.chars} 字符, {selectionInfo.lines} 行
          </span>
        )}
        <span className="status-item" title={`字数: ${wordCount}, 字符数: ${charCount}`}>
          {wordCount} 词 / {charCount} 字符
        </span>
        {meta && (
          <>
            <span className="status-item">{formatFileSize(meta.size)}</span>
            <span className="status-item">{meta.line_count} 行</span>
          </>
        )}
        {readonly && <span className="status-item readonly-badge">只读</span>}
        <span className="status-item" title="插入/覆盖模式 (Ins键切换)">
          {insertMode}
        </span>
      </div>
      <div className="status-right">
        <span className="status-item encoding-badge" onClick={onOpenEncoding} title="点击切换编码">
          {getEncodingDisplayName(encoding)}
        </span>
        <span className="status-item" title="行尾序列">
          {meta?.line_ending === "Crlf" ? "CRLF" : meta?.line_ending === "Mixed" ? "混合" : "LF"}
        </span>
        <span className="status-item" onClick={onOpenSettings} title="设置">⚙</span>
        <EditorToolbar isRecordingMacro={isRecordingMacro} onToggleMacro={handleToggleMacro} onToggleDiff={handleToggleDiff} onExport={onExport} />
        <span className="status-version" title="MarkPT v1.0.3">v1.0.3</span>
      </div>
    </div>
  );
}
