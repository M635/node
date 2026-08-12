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
  onCompareStart: () => void;
  selectionInfo: { chars: number; lines: number } | null;
}

export function MainLayout({
  children, onNewTab, onCloseTab, onSave, onSaveAll, onOpenFile, onGotoLine, onExport,
  onOpenEncoding, onOpenSettings, onFunctionList, onSplitHorizontal, onSplitVertical,
  onLanguageSelector, onCompareStart, selectionInfo,
}: MainLayoutProps) {
  const { tabs, activeTabId } = useFileStore();
  const { isSearchPanelOpen, isFindInFilesOpen, toggleSearchPanel, toggleReplacePanel, toggleFindInFiles } = useSearchStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const dispatch = (event: string) => window.dispatchEvent(new CustomEvent(event));
  const handleUndo = () => dispatch("markpt:edit-undo");
  const handleRedo = () => dispatch("markpt:edit-redo");
  const handleCut = () => document.execCommand("cut");
  const handleCopy = () => document.execCommand("copy");
  const handlePaste = () => document.execCommand("paste");
  const handleZoomIn = () => dispatch("markpt:zoom-in");
  const handleZoomOut = () => dispatch("markpt:zoom-out");
  const handleZoomReset = () => dispatch("markpt:zoom-reset");
  const handleToggleWordWrap = () => useSettingStore.getState().setWordWrap(!useSettingStore.getState().wordWrap);
  const handleToggleLineNumbers = () => useSettingStore.getState().setShowLineNumbers(!useSettingStore.getState().showLineNumbers);
  const handlePrint = () => window.print();
  const handleCompareClear = () => dispatch("markpt:compare-clear");
  const handleCompareSyncScroll = () => dispatch("markpt:compare-sync-scroll");

  return (
    <div className="main-layout">
      <TabBar onNewTab={onNewTab} onCloseTab={onCloseTab} />
      <Toolbar
        onNew={onNewTab}
        onOpen={onOpenFile}
        onSave={onSave}
        onSaveAll={onSaveAll}
        onPrint={handlePrint}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onFind={toggleSearchPanel}
        onReplace={toggleReplacePanel}
        onGotoLine={onGotoLine}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onToggleWordWrap={handleToggleWordWrap}
        onToggleLineNumbers={handleToggleLineNumbers}
        onCompareStart={onCompareStart}
        onCompareClear={handleCompareClear}
        onCompareSyncScroll={handleCompareSyncScroll}
        onSettings={onOpenSettings}
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
