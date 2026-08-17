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

const TAB_COLORS = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#1abc9c", "#34495e"];

export function TabContextMenu({ x, y, tabId, onClose }: TabContextMenuProps) {
  const { tabs, closeTab, closeOtherTabs, closeAllTabs, setActiveTab, cloneTab, lockTab, unlockTab, setTabColor } = useFileStore();
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

  const handleAction = (action: string, payload?: unknown) => {
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
          const newId = generateId();
          useFileStore.setState((state) => ({
            tabs: [...state.tabs, { ...tab, id: newId, is_dirty: true, is_new: true, path: "", name: t("tab.duplicateName", { name: tab.name }), is_locked: false, tab_color: null }],
            activeTabId: newId,
          }));
        }
        break;
      case "clone": cloneTab(tabId); break;
      case "lock": lockTab(tabId); break;
      case "unlock": unlockTab(tabId); break;
      case "setColor": setTabColor(tabId, payload as string); break;
      case "clearColor": setTabColor(tabId, null); break;
    }
    onClose();
  };

  return (
    <div ref={menuRef} className="context-menu tab-context-menu" style={{ left: x, top: y }}>
      <button className="menu-item" disabled={tab?.is_locked} onClick={() => handleAction("close")}>{t("tab.close")}</button>
      <button className="menu-item" onClick={() => handleAction("closeOthers")}>{t("tab.closeOthers")}</button>
      <button className="menu-item" disabled={tabIndex >= tabs.length - 1} onClick={() => handleAction("closeRight")}>{t("tab.closeRight")}</button>
      <button className="menu-item" disabled={tabIndex <= 0} onClick={() => handleAction("closeLeft")}>{t("tab.closeLeft")}</button>
      <button className="menu-item" onClick={() => handleAction("closeAll")}>{t("tab.closeAll")}</button>
      <div className="menu-divider" />
      <button className="menu-item" onClick={() => handleAction("duplicate")}>{t("tab.duplicate")}</button>
      <button className="menu-item" onClick={() => handleAction("clone")}>{t("tab.clone")}</button>
      <div className="menu-divider" />
      {tab?.is_locked ? (
        <button className="menu-item" onClick={() => handleAction("unlock")}>🔓 {t("tab.unlock")}</button>
      ) : (
        <button className="menu-item" onClick={() => handleAction("lock")}>🔒 {t("tab.lock")}</button>
      )}
      <div className="menu-divider" />
      <div className="menu-item-label">{t("tab.color")}</div>
      <div className="color-picker-row">
        {TAB_COLORS.map((color) => (
          <button
            key={color}
            className="color-swatch"
            style={{ backgroundColor: color }}
            onClick={() => handleAction("setColor", color)}
          />
        ))}
        <button className="color-swatch color-swatch-clear" onClick={() => handleAction("clearColor")}>×</button>
      </div>
      <div className="menu-divider" />
      <button className="menu-item" disabled={!tab?.path} onClick={() => handleAction("copyPath")}>{t("tab.copyPath")}</button>
      <button className="menu-item" disabled={!tab?.name} onClick={() => handleAction("copyName")}>{t("tab.copyName")}</button>
    </div>
  );
}
