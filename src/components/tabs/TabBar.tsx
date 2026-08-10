import { useState, type DragEvent } from "react";
import { useFileStore } from "../../stores/fileStore";
import { TabItem } from "./TabItem";
import { TabContextMenu } from "./TabContextMenu";
import type { FileTab } from "../../types/file";

interface TabBarProps {
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
}

export function TabBar({ onNewTab, onCloseTab }: TabBarProps) {
  const { tabs, activeTabId, setActiveTab, reorderTabs, closeTab, sortTabs } = useFileStore();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);
  const [showTabList, setShowTabList] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [tabListFilter, setTabListFilter] = useState("");

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
    if (dragIndex !== null && dragIndex !== index) {
      reorderTabs(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleClose = (id: string) => {
    const tab = tabs.find((t) => t.id === id);
    if (tab?.is_dirty) {
      if (window.confirm(`"${tab.name}" 已修改，是否保存？`)) {
        window.dispatchEvent(new CustomEvent("markpt:save"));
      }
    }
    closeTab(id);
    onCloseTab(id);
  };

  const filteredTabs = tabListFilter
    ? tabs.filter((t) => t.name.toLowerCase().includes(tabListFilter.toLowerCase()) || t.path.toLowerCase().includes(tabListFilter.toLowerCase()))
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
            onClose={() => handleClose(tab.id)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
          />
        ))}
      </div>
      <div className="tab-actions">
        <button className="tab-action-btn" onClick={() => setShowSortMenu((v) => !v)} title="排序标签">
          ⇅
        </button>
        {showSortMenu && (
          <div className="tab-sort-menu" onMouseLeave={() => setShowSortMenu(false)}>
            <div className="tab-sort-item" onClick={() => { sortTabs("name"); setShowSortMenu(false); }}>按名称排序</div>
            <div className="tab-sort-item" onClick={() => { sortTabs("path"); setShowSortMenu(false); }}>按路径排序</div>
            <div className="tab-sort-item" onClick={() => { sortTabs("type"); setShowSortMenu(false); }}>按类型排序</div>
            <div className="tab-sort-item" onClick={() => { sortTabs("size"); setShowSortMenu(false); }}>按大小排序</div>
          </div>
        )}
        <button className="tab-action-btn" onClick={() => setShowTabList((v) => !v)} title="标签列表">
          ☰
        </button>
        {showTabList && (
          <div className="tab-list-menu">
            <div className="tab-list-header">
              <input
                type="text"
                className="tab-list-filter"
                placeholder="过滤标签..."
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowTabList(false);
                  }}
                >
                  <span className="tab-list-name">{tab.name}</span>
                  <span className="tab-list-path">{tab.path}</span>
                  {tab.is_dirty && <span className="tab-list-dirty">●</span>}
                </div>
              ))}
              {filteredTabs.length === 0 && (
                <div className="tab-list-empty">无匹配标签</div>
              )}
            </div>
          </div>
        )}
        <button className="tab-new-btn" onClick={onNewTab} title="新建标签">
          +
        </button>
      </div>
      {contextMenu && (
        <TabContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          tabId={contextMenu.tabId}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
}
