import { useEffect, useRef } from "react";
import { useFileStore, generateId } from "../../stores/fileStore";
import { useI18n } from "../../stores/i18nStore";
import { clipboardWrite } from "../../utils/clipboard";

interface TabContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  onClose: () => void;
}

export function TabContextMenu({ x, y, tabId, onClose }: TabContextMenuProps) {
  const { tabs, closeTab, closeOtherTabs, closeAllTabs, setActiveTab } = useFileStore();
  const { t } = useI18n();
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
      case "closeRight": tabs.slice(tabIndex + 1).forEach((tb) => closeTab(tb.id)); break;
      case "closeLeft": tabs.slice(0, tabIndex).forEach((tb) => closeTab(tb.id)); break;
      case "closeAll": closeAllTabs(); break;
      case "copyPath": if (tab?.path) clipboardWrite(tab.path); break;
      case "copyName": if (tab?.name) clipboardWrite(tab.name); break;
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
      <button className="menu-item" onClick={() => handleAction("close")}>{t("tab.close")}</button>
      <button className="menu-item" onClick={() => handleAction("closeOthers")}>{t("tab.closeOthers")}</button>
      <button className="menu-item" disabled={tabIndex >= tabs.length - 1} onClick={() => handleAction("closeRight")}>{t("tab.closeRight")}</button>
      <button className="menu-item" disabled={tabIndex <= 0} onClick={() => handleAction("closeLeft")}>{t("tab.closeLeft")}</button>
      <button className="menu-item" onClick={() => handleAction("closeAll")}>{t("tab.closeAll")}</button>
      <div className="menu-divider" />
      <button className="menu-item" onClick={() => handleAction("duplicate")}>{t("tab.duplicate")}</button>
      <div className="menu-divider" />
      <button className="menu-item" disabled={!tab?.path} onClick={() => handleAction("copyPath")}>{t("tab.copyPath")}</button>
      <button className="menu-item" disabled={!tab?.name} onClick={() => handleAction("copyName")}>{t("tab.copyName")}</button>
    </div>
  );
}
