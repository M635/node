import { useState, useEffect, useRef, useCallback } from "react";
import { useFileStore } from "../../stores/fileStore";
import { useSearchStore } from "../../stores/searchStore";
import { getFileName } from "../../utils/fileUtils";

interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  onClose: () => void;
  onSave: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onGotoLine: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFindInFiles: () => void;
  onEncoding: () => void;
  onSettings: () => void;
  onToggleDiff: () => void;
  onToggleMacro: () => void;
}

export function CommandPalette({
  onClose, onSave, onNewFile, onOpenFile, onGotoLine,
  onFind, onReplace, onFindInFiles, onEncoding, onSettings,
  onToggleDiff, onToggleMacro,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tabs, setActiveTab, closeTab } = useFileStore();

  const commands: Command[] = useCallback(() => {
    const cmds: Command[] = [
      { id: "new", label: "新建文件", category: "文件", shortcut: "Cmd+N", action: onNewFile },
      { id: "open", label: "打开文件", category: "文件", shortcut: "Cmd+O", action: onOpenFile },
      { id: "save", label: "保存", category: "文件", shortcut: "Cmd+S", action: onSave },
      { id: "find", label: "查找", category: "搜索", shortcut: "Cmd+F", action: onFind },
      { id: "replace", label: "替换", category: "搜索", shortcut: "Cmd+Alt+F", action: onReplace },
      { id: "find-in-files", label: "在文件中查找", category: "搜索", shortcut: "Cmd+Shift+F", action: onFindInFiles },
      { id: "goto", label: "跳转到行", category: "导航", shortcut: "Cmd+G", action: onGotoLine },
      { id: "encoding", label: "编码转换", category: "工具", action: onEncoding },
      { id: "settings", label: "设置", category: "工具", action: onSettings },
      { id: "diff", label: "双文件对比", category: "工具", shortcut: "Cmd+Alt+D", action: onToggleDiff },
      { id: "macro", label: "宏管理", category: "工具", shortcut: "Cmd+M", action: onToggleMacro },
    ];

    tabs.forEach((tab) => {
      cmds.push({
        id: `tab-${tab.id}`,
        label: tab.name,
        category: "已打开",
        action: () => setActiveTab(tab.id),
      });
    });

    return cmds;
  }, [tabs, onNewFile, onOpenFile, onSave, onFind, onReplace, onFindInFiles, onGotoLine, onEncoding, onSettings, onToggleDiff, onToggleMacro, setActiveTab])();

  const filtered = query
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        if (cmd) { cmd.action(); onClose(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered, selectedIndex, onClose]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="command-input"
          placeholder="输入命令或文件名..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="command-list">
          {filtered.length === 0 ? (
            <div className="command-empty">无匹配结果</div>
          ) : (
            filtered.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`command-item ${idx === selectedIndex ? "selected" : ""}`}
                onClick={() => { cmd.action(); onClose(); }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className="command-category">{cmd.category}</span>
                <span className="command-label">{cmd.label}</span>
                {cmd.shortcut && <span className="command-shortcut">{cmd.shortcut}</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
