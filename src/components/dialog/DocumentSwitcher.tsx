import { useState, useEffect, useRef } from "react";
import { useFileStore } from "../../stores/fileStore";

interface DocumentSwitcherProps {
  onClose: () => void;
}

export function DocumentSwitcher({ onClose }: DocumentSwitcherProps) {
  const { tabs, activeTabId, setActiveTab } = useFileStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const sortedTabs = [...tabs].sort((a, b) => {
    if (a.id === activeTabId) return -1;
    if (b.id === activeTabId) return 1;
    return 0;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % sortedTabs.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + sortedTabs.length) % sortedTabs.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const tab = sortedTabs[selectedIndex];
        if (tab) {
          setActiveTab(tab.id);
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sortedTabs, selectedIndex, setActiveTab, onClose]);

  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog doc-switcher-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="doc-switcher-header">
          <h3>切换文档</h3>
          <span className="doc-switcher-hint">↑↓ 选择 · Enter 确认 · Esc 取消</span>
        </div>
        <div className="doc-switcher-list" ref={listRef}>
          {sortedTabs.map((tab, idx) => (
            <div
              key={tab.id}
              className={`doc-switcher-item ${idx === selectedIndex ? "selected" : ""} ${tab.is_dirty ? "dirty" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <span className="doc-icon">{tab.is_dirty ? "●" : "○"}</span>
              <span className="doc-name">{tab.name}</span>
              <span className="doc-path">{tab.path || "(未命名)"}</span>
              <span className="doc-lang">{tab.language}</span>
            </div>
          ))}
          {tabs.length === 0 && (
            <div className="doc-switcher-empty">没有打开的文档</div>
          )}
        </div>
      </div>
    </div>
  );
}
