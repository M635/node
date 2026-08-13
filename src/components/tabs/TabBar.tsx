import { useState, useRef, useEffect, type DragEvent } from "react";
import { useFileStore } from "../../stores/fileStore";
import { useI18n } from "../../stores/i18nStore";
import { TabItem } from "./TabItem";
import { TabContextMenu } from "./TabContextMenu";
import type { FileTab } from "../../types/file";

interface TabBarProps {
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
}

export function TabBar({ onNewTab, onCloseTab }: TabBarProps) {
  const { tabs, activeTabId, setActiveTab, reorderTabs, sortTabs } = useFileStore();
  const { t } = useI18n();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);
  const [showTabList, setShowTabList] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [tabListFilter, setTabListFilter] = useState("");
  const sortRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (showSortMenu && sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false);
      if (showTabList && listRef.current && !listRef.current.contains(e.target as Node)) setShowTabList(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showSortMenu, showTabList]);

  const handleDragStart = (e: DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) reorderTabs(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const handleSort = (by: "name" | "path" | "type" | "size") => {
    sortTabs(by);
    setShowSortMenu(false);
  };

  const filteredTabs = tabListFilter
    ? tabs.filter((t) =>
        t.name.toLowerCase().includes(tabListFilter.toLowerCase()) ||
        t.path.toLowerCase().includes(tabListFilter.toLowerCase()))
    : tabs;

  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {tabs.map((tab: FileTab, index: number) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            dragOver={dragOverIndex === index}
            onClick={() => setActiveTab(tab.id)}
            onClose={() => onCloseTab(tab.id)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
          />
        ))}
      </div>
      <div className="tab-actions">
        <div ref={sortRef} style={{ position: "relative" }}>
          <button className="tab-action-btn" onClick={() => setShowSortMenu(v => !v)} title={t("tab.sortByName")}>⇅</button>
          {showSortMenu && (
            <div className="tab-dropdown-menu" style={{ right: 0 }}>
              <div className="tab-dropdown-item" onClick={() => handleSort("name")}>{t("tab.sortByName")}</div>
              <div className="tab-dropdown-item" onClick={() => handleSort("path")}>{t("tab.sortByPath")}</div>
              <div className="tab-dropdown-item" onClick={() => handleSort("type")}>{t("tab.sortByType")}</div>
              <div className="tab-dropdown-item" onClick={() => handleSort("size")}>{t("tab.sortBySize")}</div>
            </div>
          )}
        </div>
        <div ref={listRef} style={{ position: "relative" }}>
          <button className="tab-action-btn" onClick={() => setShowTabList(v => !v)} title={t("tab.list")}>☰</button>
          {showTabList && (
            <div className="tab-dropdown-menu tab-list-dropdown" style={{ right: 0 }}>
              <div className="tab-list-header">
                <input
                  type="text"
                  className="tab-list-filter"
                  placeholder={t("tab.filterPlaceholder")}
                  value={tabListFilter}
                  onChange={(e) => setTabListFilter(e.target.value)}
                  autoFocus
                />
                <span className="tab-list-count">{filteredTabs.length}/{tabs.length}</span>
              </div>
              <div className="tab-list-items">
                {filteredTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`tab-list-item ${tab.id === activeTabId ? "active" : ""}`}
                    onClick={() => { setActiveTab(tab.id); setShowTabList(false); }}
                  >
                    <span className="tab-list-name">{tab.name}</span>
                    <span className="tab-list-path">{tab.path}</span>
                    {tab.is_dirty && <span className="tab-list-dirty">●</span>}
                  </div>
                ))}
                {filteredTabs.length === 0 && <div className="tab-list-empty">{t("cmd.noResult")}</div>}
              </div>
            </div>
          )}
        </div>
        <button className="tab-new-btn" onClick={onNewTab} title={t("tab.new")}>+</button>
      </div>
      {contextMenu && (
        <TabContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          tabId={contextMenu.tabId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
