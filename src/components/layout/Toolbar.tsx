interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onFind: () => void;
  onReplace: () => void;
  onGotoLine: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleWordWrap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onEncoding: () => void;
  onSettings: () => void;
}

export function Toolbar({
  onNew, onOpen, onSave, onSaveAll, onFind, onReplace, onGotoLine,
  onUndo, onRedo, onToggleWordWrap, onZoomIn, onZoomOut, onEncoding, onSettings,
}: ToolbarProps) {
  return (
    <div className="main-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onNew} title="新建 (Cmd+N)">📄</button>
        <button className="toolbar-icon-btn" onClick={onOpen} title="打开 (Cmd+O)">📂</button>
        <button className="toolbar-icon-btn" onClick={onSave} title="保存 (Cmd+S)">💾</button>
        <button className="toolbar-icon-btn" onClick={onSaveAll} title="保存所有">💾✚</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onUndo} title="撤销 (Cmd+Z)">↶</button>
        <button className="toolbar-icon-btn" onClick={onRedo} title="重做 (Cmd+Shift+Z)">↷</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onFind} title="查找 (Cmd+F)">🔍</button>
        <button className="toolbar-icon-btn" onClick={onReplace} title="替换 (Cmd+H)">🔄</button>
        <button className="toolbar-icon-btn" onClick={onGotoLine} title="跳转行 (Cmd+G)">↕</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onZoomIn} title="放大 (Cmd+=)">🔍+</button>
        <button className="toolbar-icon-btn" onClick={onZoomOut} title="缩小 (Cmd+-)">🔍-</button>
        <button className="toolbar-icon-btn" onClick={onToggleWordWrap} title="自动换行">↩</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onEncoding} title="编码">🔤</button>
        <button className="toolbar-icon-btn" onClick={onSettings} title="设置">⚙</button>
      </div>
      <div className="toolbar-spacer" />
    </div>
  );
}
