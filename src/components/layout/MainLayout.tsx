import type { ReactNode } from "react";
import { TabBar } from "../tabs/TabBar";
import { StatusBar } from "./StatusBar";
import { Toolbar } from "./Toolbar";
import { useFileStore } from "../../stores/fileStore";
import { useSearchStore } from "../../stores/searchStore";
import { useSettingStore } from "../../stores/settingStore";
import { SearchPanel } from "../search/SearchPanel";
import { FindInFilesPanel } from "../search/FindInFilesPanel";

interface MainLayoutProps {
  children: ReactNode;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
  onSave: () => void;
  onSaveAll: () => void;
  onOpenFile: () => void;
  onGotoLine: () => void;
  onExport: (format: "txt" | "html" | "rtf") => void;
  onOpenEncoding: () => void;
  onOpenSettings: () => void;
  onFunctionList: () => void;
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
  onLanguageSelector: () => void;
  selectionInfo: { chars: number; lines: number } | null;
}

export function MainLayout({
  children, onNewTab, onCloseTab, onSave, onSaveAll, onOpenFile, onGotoLine, onExport,
  onOpenEncoding, onOpenSettings, onFunctionList, onSplitHorizontal, onSplitVertical, onLanguageSelector,
  selectionInfo,
}: MainLayoutProps) {
  const { tabs, activeTabId } = useFileStore();
  const { isSearchPanelOpen, isFindInFilesOpen, toggleSearchPanel, toggleReplacePanel, toggleFindInFiles } = useSearchStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleUndo = () => window.dispatchEvent(new CustomEvent("markpt:edit-action", { detail: { action: "undo" } }));
  const handleRedo = () => window.dispatchEvent(new CustomEvent("markpt:edit-action", { detail: { action: "redo" } }));
  const handleCut = () => document.execCommand("cut");
  const handleCopy = () => document.execCommand("copy");
  const handlePaste = () => document.execCommand("paste");
  const handleZoomIn = () => window.dispatchEvent(new CustomEvent("markpt:zoom-in"));
  const handleZoomOut = () => window.dispatchEvent(new CustomEvent("markpt:zoom-out"));
  const handleToggleWordWrap = () => useSettingStore.getState().setWordWrap(!useSettingStore.getState().wordWrap);
  const handleToggleInvisible = () => useSettingStore.getState().setShowWhitespace(!useSettingStore.getState().showWhitespace);
  const handleToggleIndentGuide = () => useSettingStore.getState().setShowIndentGuides(!useSettingStore.getState().showIndentGuides);
  const handlePrint = () => window.print();
  const handleClose = () => activeTabId && onCloseTab(activeTabId);
  const handleCloseAll = () => {
    const allTabs = [...useFileStore.getState().tabs];
    for (const tab of allTabs) onCloseTab(tab.id);
  };

  return (
    <div className="main-layout">
      <TabBar onNewTab={onNewTab} onCloseTab={onCloseTab} />
      <Toolbar
        onNew={onNewTab}
        onOpen={onOpenFile}
        onSave={onSave}
        onSaveAll={onSaveAll}
        onClose={handleClose}
        onCloseAll={handleCloseAll}
        onFind={toggleSearchPanel}
        onReplace={toggleReplacePanel}
        onFindInFiles={toggleFindInFiles}
        onGotoLine={onGotoLine}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onToggleWordWrap={handleToggleWordWrap}
        onToggleInvisible={handleToggleInvisible}
        onToggleIndentGuide={handleToggleIndentGuide}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onEncoding={onOpenEncoding}
        onSettings={onOpenSettings}
        onFunctionList={onFunctionList}
        onSplitHorizontal={onSplitHorizontal}
        onSplitVertical={onSplitVertical}
        onLanguageSelector={onLanguageSelector}
        onPrint={handlePrint}
      />
      <div className="editor-area">
        {isSearchPanelOpen && <SearchPanel />}
        {isFindInFilesOpen && <FindInFilesPanel />}
        <div className="editor-content">{children}</div>
      </div>
      <StatusBar
        activeTab={activeTab || null}
        onSave={onSave}
        onOpenFile={onOpenFile}
        onGotoLine={onGotoLine}
        onExport={onExport}
        onOpenEncoding={onOpenEncoding}
        onOpenSettings={onOpenSettings}
        selectionInfo={selectionInfo}
      />
    </div>
  );
}
