import { useSettingStore } from "../../stores/settingStore";

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onClose: () => void;
  onCloseAll: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFindInFiles: () => void;
  onGotoLine: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleWordWrap: () => void;
  onToggleInvisible: () => void;
  onToggleIndentGuide: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onEncoding: () => void;
  onSettings: () => void;
  onFunctionList: () => void;
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
  onLanguageSelector: () => void;
  onPrint: () => void;
}

export function Toolbar({
  onNew, onOpen, onSave, onSaveAll, onClose, onCloseAll,
  onFind, onReplace, onFindInFiles, onGotoLine,
  onUndo, onRedo, onCut, onCopy, onPaste,
  onToggleWordWrap, onToggleInvisible, onToggleIndentGuide,
  onZoomIn, onZoomOut, onEncoding, onSettings,
  onFunctionList, onSplitHorizontal, onSplitVertical, onLanguageSelector, onPrint,
}: ToolbarProps) {
  const { wordWrap, showWhitespace, showIndentGuides } = useSettingStore();

  return (
    <div className="main-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onNew} title="新建 (Cmd+N)">📄</button>
        <button className="toolbar-icon-btn" onClick={onOpen} title="打开 (Cmd+O)">📂</button>
        <button className="toolbar-icon-btn" onClick={onSave} title="保存 (Cmd+S)">💾</button>
        <button className="toolbar-icon-btn" onClick={onSaveAll} title="保存所有">💾✚</button>
        <button className="toolbar-icon-btn" onClick={onClose} title="关闭">✕</button>
        <button className="toolbar-icon-btn" onClick={onCloseAll} title="关闭所有">✕✕</button>
        <button className="toolbar-icon-btn" onClick={onPrint} title="打印">🖨</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onCut} title="剪切 (Cmd+X)">✂</button>
        <button className="toolbar-icon-btn" onClick={onCopy} title="复制 (Cmd+C)">📋</button>
        <button className="toolbar-icon-btn" onClick={onPaste} title="粘贴 (Cmd+V)">📌</button>
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
        <button className="toolbar-icon-btn" onClick={onFindInFiles} title="在文件中查找 (Cmd+Shift+F)">📁🔍</button>
        <button className="toolbar-icon-btn" onClick={onGotoLine} title="跳转行 (Cmd+G)">↕</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onZoomIn} title="放大 (Cmd+=)">🔍+</button>
        <button className="toolbar-icon-btn" onClick={onZoomOut} title="缩小 (Cmd+-)">🔍-</button>
        <button className={`toolbar-icon-btn ${wordWrap ? "active" : ""}`} onClick={onToggleWordWrap} title="自动换行">↩</button>
        <button className={`toolbar-icon-btn ${showWhitespace ? "active" : ""}`} onClick={onToggleInvisible} title="显示不可见字符">¶</button>
        <button className={`toolbar-icon-btn ${showIndentGuides ? "active" : ""}`} onClick={onToggleIndentGuide} title="显示缩进指南">⋮⋮</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onFunctionList} title="函数列表">ƒ</button>
        <button className="toolbar-icon-btn" onClick={onSplitHorizontal} title="水平分屏">⬌</button>
        <button className="toolbar-icon-btn" onClick={onSplitVertical} title="垂直分屏">⬓</button>
        <button className="toolbar-icon-btn" onClick={onLanguageSelector} title="选择语言">📝</button>
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
