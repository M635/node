import { useEffect, useRef } from "react";
import { useFileStore, generateId } from "../../stores/fileStore";

interface TabContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  onClose: () => void;
}

export function TabContextMenu({ x, y, tabId, onClose }: TabContextMenuProps) {
  const { tabs, closeTab, closeOtherTabs, closeAllTabs, setActiveTab } = useFileStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const tabIndex = tabs.findIndex((t) => t.id === tabId);
  const tab = tabs.find((t) => t.id === tabId);

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
      case "close": closeTab(tabId); break;
      case "closeOthers": closeOtherTabs(tabId); break;
      case "closeRight": tabs.slice(tabIndex + 1).forEach((t) => closeTab(t.id)); break;
      case "closeLeft": tabs.slice(0, tabIndex).forEach((t) => closeTab(t.id)); break;
      case "closeAll": closeAllTabs(); break;
      case "copyPath": if (tab?.path) navigator.clipboard.writeText(tab.path); break;
      case "copyName": if (tab?.name) navigator.clipboard.writeText(tab.name); break;
      case "duplicate":
        if (tab) {
          useFileStore.setState((state) => ({
            tabs: [...state.tabs, { ...tab, id: generateId(), is_dirty: true, is_new: true, path: "", name: `${tab.name} 副本` }],
            activeTabId: tab.id,
          }));
        }
        break;
    }
    onClose();
  };

  return (
    <div ref={menuRef} className="context-menu tab-context-menu" style={{ left: x, top: y }}>
      <button className="menu-item" onClick={() => handleAction("close")}>关闭标签</button>
      <button className="menu-item" onClick={() => handleAction("closeOthers")}>关闭其他</button>
      <button className="menu-item" disabled={tabIndex >= tabs.length - 1} onClick={() => handleAction("closeRight")}>关闭右侧</button>
      <button className="menu-item" disabled={tabIndex <= 0} onClick={() => handleAction("closeLeft")}>关闭左侧</button>
      <button className="menu-item" onClick={() => handleAction("closeAll")}>关闭全部</button>
      <div className="menu-divider" />
      <button className="menu-item" onClick={() => handleAction("duplicate")}>创建副本</button>
      <div className="menu-divider" />
      <button className="menu-item" disabled={!tab?.path} onClick={() => handleAction("copyPath")}>复制路径</button>
      <button className="menu-item" disabled={!tab?.name} onClick={() => handleAction("copyName")}>复制文件名</button>
    </div>
  );
}
