import type { ReactNode } from "react";
import { TabBar } from "../tabs/TabBar";
import { StatusBar } from "./StatusBar";
import { useFileStore } from "../../stores/fileStore";
import { useSearchStore } from "../../stores/searchStore";
import { SearchPanel } from "../search/SearchPanel";
import { FindInFilesPanel } from "../search/FindInFilesPanel";

interface MainLayoutProps {
  children: ReactNode;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
  onSave: () => void;
  onOpenFile: () => void;
  onGotoLine: () => void;
  onExport: (format: "txt" | "html" | "rtf") => void;
  onOpenEncoding: () => void;
  onOpenSettings: () => void;
}

export function MainLayout({
  children, onNewTab, onCloseTab, onSave, onOpenFile, onGotoLine, onExport,
  onOpenEncoding, onOpenSettings,
}: MainLayoutProps) {
  const { tabs, activeTabId } = useFileStore();
  const { isSearchPanelOpen, isFindInFilesOpen } = useSearchStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="main-layout">
      <div className="title-bar-space" />
      <TabBar onNewTab={onNewTab} onCloseTab={onCloseTab} />
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
      />
    </div>
  );
}
