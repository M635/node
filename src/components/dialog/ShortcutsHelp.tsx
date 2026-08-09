interface ShortcutsHelpProps {
  onClose: () => void;
}

const SHORTCUTS: { category: string; keys: { key: string; desc: string }[] }[] = [
  {
    category: "文件",
    keys: [
      { key: "Cmd+N", desc: "新建文件" },
      { key: "Cmd+O", desc: "打开文件" },
      { key: "Cmd+S", desc: "保存" },
      { key: "Cmd+W", desc: "关闭标签" },
      { key: "Cmd+P", desc: "命令面板" },
    ],
  },
  {
    category: "编辑",
    keys: [
      { key: "Cmd+Z", desc: "撤销" },
      { key: "Cmd+Shift+Z", desc: "重做" },
      { key: "Cmd+F", desc: "查找" },
      { key: "Cmd+Alt+F", desc: "替换" },
      { key: "Cmd+G", desc: "跳转到行" },
      { key: "Cmd+Shift+F", desc: "在文件中查找" },
      { key: "Cmd+B", desc: "切换书签" },
      { key: "Cmd+Shift+B", desc: "下一个书签" },
    ],
  },
  {
    category: "视图",
    keys: [
      { key: "Cmd+\\", desc: "切换侧边栏" },
      { key: "Cmd+Alt+D", desc: "双文件对比" },
      { key: "Cmd+M", desc: "宏管理" },
      { key: "Cmd++", desc: "放大字体" },
      { key: "Cmd+-", desc: "缩小字体" },
    ],
  },
  {
    category: "多光标",
    keys: [
      { key: "Cmd+D", desc: "选择下一个匹配" },
      { key: "Cmd+Shift+L", desc: "选择所有匹配" },
      { key: "Alt+Click", desc: "添加光标" },
      { key: "Shift+Alt+Drag", desc: "列块选择" },
    ],
  },
];

export function ShortcutsHelp({ onClose }: ShortcutsHelpProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>快捷键</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {SHORTCUTS.map((group) => (
            <div key={group.category} className="shortcut-group">
              <h3>{group.category}</h3>
              {group.keys.map((item) => (
                <div key={item.key} className="shortcut-row">
                  <span className="shortcut-desc">{item.desc}</span>
                  <span className="shortcut-key">{item.key}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
