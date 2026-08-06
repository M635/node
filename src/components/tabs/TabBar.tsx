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
  const { tabs, activeTabId, setActiveTab, reorderTabs, closeTab } = useFileStore();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

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
        window.dispatchEvent(new CustomEvent("macpad:save"));
      }
    }
    closeTab(id);
    onCloseTab(id);
  };

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
      <button className="tab-new-btn" onClick={onNewTab} title="新建标签">
        +
      </button>
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
