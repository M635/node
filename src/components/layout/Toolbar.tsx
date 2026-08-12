import { useSettingStore } from "../../stores/settingStore";

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onPrint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onFind: () => void;
  onReplace: () => void;
  onGotoLine: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleWordWrap: () => void;
  onToggleLineNumbers: () => void;
  onCompareStart: () => void;
  onCompareClear: () => void;
  onCompareSyncScroll: () => void;
  onSettings: () => void;
}

export function Toolbar({
  onNew, onOpen, onSave, onSaveAll, onPrint,
  onUndo, onRedo, onCut, onCopy, onPaste,
  onFind, onReplace, onGotoLine,
  onZoomIn, onZoomOut, onZoomReset, onToggleWordWrap, onToggleLineNumbers,
  onCompareStart, onCompareClear, onCompareSyncScroll,
  onSettings,
}: ToolbarProps) {
  const { wordWrap, showLineNumbers } = useSettingStore();

  return (
    <div className="main-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onNew} title="新建 (Cmd+N)">📄</button>
        <button className="toolbar-icon-btn" onClick={onOpen} title="打开 (Cmd+O)">📂</button>
        <button className="toolbar-icon-btn" onClick={onSave} title="保存 (Cmd+S)">💾</button>
        <button className="toolbar-icon-btn" onClick={onSaveAll} title="全部保存">💾✚</button>
        <button className="toolbar-icon-btn" onClick={onPrint} title="打印">🖨</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onUndo} title="撤销 (Cmd+Z)">↶</button>
        <button className="toolbar-icon-btn" onClick={onRedo} title="重做 (Cmd+Shift+Z)">↷</button>
        <button className="toolbar-icon-btn" onClick={onCut} title="剪切 (Cmd+X)">✂</button>
        <button className="toolbar-icon-btn" onClick={onCopy} title="复制 (Cmd+C)">📋</button>
        <button className="toolbar-icon-btn" onClick={onPaste} title="粘贴 (Cmd+V)">📌</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onFind} title="查找 (Cmd+F)">🔍</button>
        <button className="toolbar-icon-btn" onClick={onReplace} title="替换 (Cmd+H)">🔄</button>
        <button className="toolbar-icon-btn" onClick={onGotoLine} title="转到行 (Cmd+G)">↕</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onZoomIn} title="放大 (Cmd+=)">＋</button>
        <button className="toolbar-icon-btn" onClick={onZoomOut} title="缩小 (Cmd+-)">－</button>
        <button className="toolbar-icon-btn" onClick={onZoomReset} title="重置缩放 (Cmd+0)">1:1</button>
        <button className={`toolbar-icon-btn ${wordWrap ? "active" : ""}`} onClick={onToggleWordWrap} title="自动换行">↩</button>
        <button className={`toolbar-icon-btn ${showLineNumbers ? "active" : ""}`} onClick={onToggleLineNumbers} title="显示行号">#</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onCompareStart} title="开始对比">↔</button>
        <button className="toolbar-icon-btn" onClick={onCompareClear} title="清除对比">✕</button>
        <button className="toolbar-icon-btn" onClick={onCompareSyncScroll} title="同步滚动">⇕</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onSettings} title="设置">⚙</button>
      </div>
      <div className="toolbar-spacer" />
    </div>
  );
}
