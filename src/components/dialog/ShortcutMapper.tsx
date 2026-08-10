interface ShortcutMapperProps {
  onClose: () => void;
}

interface ShortcutItem {
  category: string;
  action: string;
  shortcut: string;
  description: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { category: "文件", action: "新建", shortcut: "Cmd/Ctrl+N", description: "创建新文件" },
  { category: "文件", action: "打开", shortcut: "Cmd/Ctrl+O", description: "打开文件" },
  { category: "文件", action: "保存", shortcut: "Cmd/Ctrl+S", description: "保存当前文件" },
  { category: "文件", action: "关闭标签", shortcut: "Cmd/Ctrl+W", description: "关闭当前标签" },
  { category: "搜索", action: "查找", shortcut: "Cmd/Ctrl+F", description: "打开查找面板" },
  { category: "搜索", action: "替换", shortcut: "Cmd/Ctrl+H", description: "打开替换面板" },
  { category: "搜索", action: "跳转行", shortcut: "Cmd/Ctrl+G", description: "跳转到指定行" },
  { category: "搜索", action: "在文件中查找", shortcut: "Cmd/Ctrl+Shift+F", description: "全局目录搜索" },
  { category: "搜索", action: "多文档查找替换", shortcut: "Cmd/Ctrl+Shift+F", description: "在所有打开文件中搜索替换" },
  { category: "编辑", action: "删除当前行", shortcut: "Cmd/Ctrl+D", description: "删除光标所在行" },
  { category: "编辑", action: "复制当前行", shortcut: "Shift+Alt+D", description: "复制光标所在行" },
  { category: "编辑", action: "上移行", shortcut: "Alt+↑", description: "将当前行上移" },
  { category: "编辑", action: "下移行", shortcut: "Alt+↓", description: "将当前行下移" },
  { category: "编辑", action: "转大写", shortcut: "Cmd/Ctrl+Shift+U", description: "选区转大写" },
  { category: "编辑", action: "转小写", shortcut: "Cmd/Ctrl+Shift+L", description: "选区转小写" },
  { category: "编辑", action: "切换注释", shortcut: "Cmd/Ctrl+/", description: "切换行注释" },
  { category: "编辑", action: "撤销", shortcut: "Cmd/Ctrl+Z", description: "撤销" },
  { category: "编辑", action: "重做", shortcut: "Cmd/Ctrl+Shift+Z", description: "重做" },
  { category: "编辑", action: "全选", shortcut: "Cmd/Ctrl+A", description: "全选" },
  { category: "视图", action: "命令面板", shortcut: "Cmd/Ctrl+P", description: "打开命令面板" },
  { category: "视图", action: "切换侧边栏", shortcut: "Cmd/Ctrl+\\", description: "显示/隐藏侧边栏" },
  { category: "视图", action: "函数列表", shortcut: "Cmd/Ctrl+Shift+O", description: "显示函数列表" },
  { category: "视图", action: "字符统计", shortcut: "Cmd/Ctrl+Shift+C", description: "显示字符统计" },
  { category: "视图", action: "十六进制查看", shortcut: "Cmd/Ctrl+Shift+H", description: "十六进制模式查看" },
  { category: "视图", action: "快捷键帮助", shortcut: "Cmd/Ctrl+/", description: "显示快捷键帮助" },
  { category: "工具", action: "编码设置", shortcut: "—", description: "设置文件编码" },
  { category: "工具", action: "设置", shortcut: "—", description: "打开设置对话框" },
  { category: "工具", action: "宏录制", shortcut: "—", description: "开始/停止宏录制" },
  { category: "工具", action: "Diff对比", shortcut: "—", description: "双文件对比" },
  { category: "书签", action: "切换书签", shortcut: "—", description: "在当前行切换书签" },
  { category: "书签", action: "下一书签", shortcut: "F2", description: "跳转到下一书签" },
  { category: "书签", action: "上一书签", shortcut: "Shift+F2", description: "跳转到上一书签" },
  { category: "编辑器", action: "多光标", shortcut: "Cmd/Ctrl+Click", description: "添加光标" },
  { category: "编辑器", action: "列选择", shortcut: "Shift+Alt+Drag", description: "列块选择" },
  { category: "编辑器", action: "查找下一个", shortcut: "F3", description: "查找下一个匹配" },
  { category: "编辑器", action: "查找上一个", shortcut: "Shift+F3", description: "查找上一个匹配" },
];

export function ShortcutMapper({ onClose }: ShortcutMapperProps) {
  const categories = [...new Set(SHORTCUTS.map((s) => s.category))];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog shortcut-mapper-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>快捷键映射</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {categories.map((cat) => (
            <div key={cat} className="shortcut-category">
              <h4>{cat}</h4>
              <table className="shortcut-table">
                <thead>
                  <tr>
                    <th>操作</th>
                    <th>快捷键</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  {SHORTCUTS.filter((s) => s.category === cat).map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.action}</td>
                      <td><kbd>{s.shortcut}</kbd></td>
                      <td>{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
