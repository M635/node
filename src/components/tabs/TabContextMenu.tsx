import { useEffect, useRef } from "react";
import { useFileStore } from "../../stores/fileStore";

interface TabContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  onClose: () => void;
}

export function TabContextMenu({ x, y, tabId, onClose }: TabContextMenuProps) {
  const { closeTab, closeOtherTabs, closeAllTabs, setActiveTab } = useFileStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleAction = (action: string) => {
    setActiveTab(tabId);
    switch (action) {
      case "close":
        closeTab(tabId);
        break;
      case "closeOthers":
        closeOtherTabs(tabId);
        break;
      case "closeAll":
        closeAllTabs();
        break;
      case "copyPath":
        const tab = useFileStore.getState().tabs.find((t) => t.id === tabId);
        if (tab?.path) {
          navigator.clipboard.writeText(tab.path);
        }
        break;
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="context-menu tab-context-menu"
      style={{ left: x, top: y }}
    >
      <button className="menu-item" onClick={() => handleAction("close")}>
        关闭标签
      </button>
      <button className="menu-item" onClick={() => handleAction("closeOthers")}>
        关闭其他标签
      </button>
      <button className="menu-item" onClick={() => handleAction("closeAll")}>
        关闭所有标签
      </button>
      <div className="menu-divider" />
      <button className="menu-item" onClick={() => handleAction("copyPath")}>
        复制路径
      </button>
    </div>
  );
}
