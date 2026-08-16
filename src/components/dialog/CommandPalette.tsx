import { useState, useEffect, useRef, useCallback } from "react";
import { useFileStore } from "../../stores/fileStore";
import { useSearchStore } from "../../stores/searchStore";
import { useI18n } from "../../stores/i18nStore";
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
  const { t } = useI18n();
  const mod = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "Cmd" : "Ctrl";

  const commands: Command[] = useCallback(() => {
    const cmds: Command[] = [
      { id: "new", label: t("cmd.newFile"), category: t("cmd.category.file"), shortcut: `${mod}+N`, action: onNewFile },
      { id: "open", label: t("cmd.openFile"), category: t("cmd.category.file"), shortcut: `${mod}+O`, action: onOpenFile },
      { id: "save", label: t("cmd.save"), category: t("cmd.category.file"), shortcut: `${mod}+S`, action: onSave },
      { id: "find", label: t("cmd.find"), category: t("cmd.category.search"), shortcut: `${mod}+F`, action: onFind },
      { id: "replace", label: t("cmd.replace"), category: t("cmd.category.search"), shortcut: `${mod}+Alt+F`, action: onReplace },
      { id: "find-in-files", label: t("cmd.findInFiles"), category: t("cmd.category.search"), shortcut: `${mod}+Shift+F`, action: onFindInFiles },
      { id: "goto", label: t("cmd.gotoLine"), category: t("cmd.category.nav"), shortcut: `${mod}+G`, action: onGotoLine },
      { id: "encoding", label: t("cmd.encoding"), category: t("cmd.category.tool"), action: onEncoding },
      { id: "settings", label: t("cmd.settings"), category: t("cmd.category.tool"), action: onSettings },
      { id: "diff", label: t("cmd.compare"), category: t("cmd.category.tool"), shortcut: `${mod}+Alt+D`, action: onToggleDiff },
      { id: "macro", label: t("cmd.macro"), category: t("cmd.category.tool"), shortcut: `${mod}+M`, action: onToggleMacro },
    ];

    tabs.forEach((tab) => {
      cmds.push({
        id: `tab-${tab.id}`,
        label: tab.name,
        category: t("cmd.category.opened"),
        action: () => setActiveTab(tab.id),
      });
    });

    return cmds;
  }, [tabs, onNewFile, onOpenFile, onSave, onFind, onReplace, onFindInFiles, onGotoLine, onEncoding, onSettings, onToggleDiff, onToggleMacro, setActiveTab, t, mod])();

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
          placeholder={t("cmd.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="command-list">
          {filtered.length === 0 ? (
            <div className="command-empty">{t("cmd.noResult")}</div>
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
