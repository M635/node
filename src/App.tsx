import { useState, useCallback, useEffect } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { MainLayout } from "./components/layout/MainLayout";
import { MonacoEditor } from "./components/editor/MonacoEditor";
import { DiffEditorView } from "./components/editor/DiffEditor";
import { EncodingDialog } from "./components/dialog/EncodingDialog";
import { SettingsDialog } from "./components/dialog/SettingsDialog";
import { GoToLineDialog } from "./components/dialog/GoToLineDialog";
import { ReloadConfirmDialog } from "./components/dialog/ReloadConfirmDialog";
import { MacroPanel } from "./components/macro/MacroPanel";
import { useFileStore, generateId } from "./stores/fileStore";
import { useEditorStore } from "./stores/editorStore";
import { useSearchStore } from "./stores/searchStore";
import { useSettingStore } from "./stores/settingStore";
import { useTheme } from "./hooks/useTheme";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useFileWatcher } from "./hooks/useFileWatcher";
import {
  openFile as openFileService,
  saveFile as saveFileService,
  reloadWithEncoding,
} from "./services/tauri/fileService";
import { exportAsTxt, exportAsHtml, exportAsRtf } from "./services/tauri/exportService";
import { getLanguageFromPath } from "./services/monaco/languages";
import { getFileName } from "./utils/fileUtils";
import type { EncodingType, FileTab } from "./types/file";

export default function App() {
  const {
    tabs, activeTabId, openTab, closeTab, updateTab, updateContent, markClean, getActiveTab,
  } = useFileStore();
  const { isDark, setIsDark, toggleBookmark } = useEditorStore();
  const { toggleSearchPanel, toggleReplacePanel, toggleFindInFiles } = useSearchStore();
  const { themeMode } = useSettingStore();

  const [showEncodingDialog, setShowEncodingDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showGoToLineDialog, setShowGoToLineDialog] = useState(false);
  const [showMacroPanel, setShowMacroPanel] = useState(false);
  const [showDiffView, setShowDiffView] = useState(false);
  const [diffContent, setDiffContent] = useState({ original: "", modified: "" });
  const [reloadDialog, setReloadDialog] = useState<string | null>(null);

  const themeResult = useTheme(themeMode);
  useEffect(() => { setIsDark(themeResult.isDark); }, [themeResult.isDark, setIsDark]);

  const activeTab = getActiveTab();

  const handleNewFile = useCallback(() => {
    const id = generateId();
    openTab({
      id, path: "", name: "未命名", content: "", meta: null,
      is_dirty: false, is_large_file: false, readonly: false,
      encoding: "UTF-8", language: "plaintext",
      cursor_position: { line: 1, column: 1 }, scroll_position: 0, is_new: true,
    });
  }, [openTab]);

  const handleOpenFile = useCallback(async () => {
    const selected = await open({ multiple: false, filters: [{ name: "所有文件", extensions: ["*"] }] });
    if (!selected) return;
    const path = selected as string;
    try {
      const result = await openFileService(path);
      openTab({
        id: generateId(), path, name: getFileName(path), content: result.content,
        meta: result.meta, is_dirty: false, is_large_file: result.is_large_file,
        readonly: result.meta.readonly, encoding: result.meta.encoding,
        language: getLanguageFromPath(path),
        cursor_position: { line: 1, column: 1 }, scroll_position: 0, is_new: false,
      });
    } catch (err) {
      alert(`打开文件失败: ${err}`);
    }
  }, [openTab]);

  const handleSave = useCallback(async () => {
    const tab = getActiveTab();
    if (!tab) return;
    let savePath = tab.path;
    if (!savePath || tab.is_new) {
      const selected = await save({ filters: [{ name: "所有文件", extensions: ["*"] }] });
      if (!selected) return;
      savePath = selected as string;
    }
    try {
      await saveFileService(savePath, tab.content, tab.encoding);
      updateTab(tab.id, { path: savePath, name: getFileName(savePath), is_new: false, is_dirty: false });
      markClean(tab.id);
    } catch (err) {
      alert(`保存失败: ${err}`);
    }
  }, [getActiveTab, updateTab, markClean]);

  const handleCloseTab = useCallback(async (id: string) => {
    const tab = tabs.find((t) => t.id === id);
    if (tab?.is_dirty) {
      const shouldSave = window.confirm(`"${tab.name}" 已修改，是否保存？`);
      if (shouldSave) {
        let savePath = tab.path;
        if (!savePath || tab.is_new) {
          const selected = await save({ filters: [{ name: "所有文件", extensions: ["*"] }] });
          if (!selected) { closeTab(id); return; }
          savePath = selected as string;
        }
        try {
          await saveFileService(savePath, tab.content, tab.encoding);
        } catch { /* ignore */ }
      }
    }
    closeTab(id);
  }, [tabs, closeTab]);

  const handleGotoLine = useCallback(() => setShowGoToLineDialog(true), []);

  const handleContentChange = useCallback((content: string) => {
    if (activeTabId) updateContent(activeTabId, content);
  }, [activeTabId, updateContent]);

  const handleCursorChange = useCallback((line: number, column: number) => {
    if (activeTabId) updateTab(activeTabId, { cursor_position: { line, column } });
  }, [activeTabId, updateTab]);

  const handleEncodingChange = useCallback(async (encoding: EncodingType) => {
    const tab = getActiveTab();
    if (!tab || !tab.path) { setShowEncodingDialog(false); return; }
    try {
      const newContent = await reloadWithEncoding(tab.path, encoding);
      updateTab(tab.id, { encoding, content: newContent, is_dirty: false });
    } catch (err) {
      alert(`编码转换失败: ${err}`);
    }
    setShowEncodingDialog(false);
  }, [getActiveTab, updateTab]);

  const handleGotoLineConfirm = useCallback((line: number) => {
    window.dispatchEvent(new CustomEvent("macpad:goto-line-confirm", { detail: { line } }));
    setShowGoToLineDialog(false);
  }, []);

  const handleExport = useCallback(async (format: "txt" | "html" | "rtf") => {
    const tab = getActiveTab();
    if (!tab) return;
    const ext = format === "txt" ? "txt" : format === "html" ? "html" : "rtf";
    const selected = await save({ defaultPath: `${tab.name}.${ext}`, filters: [{ name: format.toUpperCase(), extensions: [ext] }] });
    if (!selected) return;
    try {
      if (format === "txt") await exportAsTxt(selected as string, tab.content);
      else if (format === "html") await exportAsHtml(selected as string, tab.content, tab.name);
      else await exportAsRtf(selected as string, tab.content);
    } catch (err) {
      alert(`导出失败: ${err}`);
    }
  }, [getActiveTab]);

  const handleToggleDiff = useCallback(async () => {
    if (showDiffView) { setShowDiffView(false); return; }
    const selected = await open({ multiple: false, filters: [{ name: "所有文件", extensions: ["*"] }] });
    if (!selected) return;
    try {
      const result = await openFileService(selected as string);
      setDiffContent({ original: getActiveTab()?.content || "", modified: result.content });
      setShowDiffView(true);
    } catch (err) {
      alert(`打开对比文件失败: ${err}`);
    }
  }, [showDiffView, getActiveTab]);

  const handleFileChanged = useCallback((path: string) => {
    const tab = useFileStore.getState().getTabByPath(path);
    if (tab && !tab.is_dirty) setReloadDialog(path);
  }, []);

  useFileWatcher(activeTab?.path || null, handleFileChanged);

  const handleReload = useCallback(async () => {
    if (!reloadDialog) return;
    const tab = useFileStore.getState().getTabByPath(reloadDialog);
    if (tab) {
      try {
        const result = await openFileService(reloadDialog);
        updateTab(tab.id, { content: result.content, meta: result.meta, is_dirty: false });
      } catch { /* ignore */ }
    }
    setReloadDialog(null);
  }, [reloadDialog, updateTab]);

  // 搜索结果点击跳转
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.path && detail?.line) {
        const tab = useFileStore.getState().getTabByPath(detail.path);
        if (tab) {
          useFileStore.getState().setActiveTab(tab.id);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("macpad:goto-line-confirm", { detail: { line: detail.line } }));
          }, 100);
        }
      }
    };
    window.addEventListener("macpad:open-search-result", handler);
    return () => window.removeEventListener("macpad:open-search-result", handler);
  }, []);

  useKeyboardShortcuts({
    onSave: handleSave,
    onFind: toggleSearchPanel,
    onReplace: toggleReplacePanel,
    onGotoLine: handleGotoLine,
    onNewFile: handleNewFile,
    onOpenFile: handleOpenFile,
    onCloseTab: () => activeTabId && handleCloseTab(activeTabId),
    onFindInFiles: toggleFindInFiles,
    onToggleBookmark: () => {
      if (activeTabId && activeTab) toggleBookmark(activeTabId, activeTab.cursor_position.line);
    },
    onToggleMacro: () => setShowMacroPanel((v) => !v),
    onToggleDiff: handleToggleDiff,
    onEncoding: () => setShowEncodingDialog(true),
    onSettings: () => setShowSettingsDialog(true),
  });

  useEffect(() => {
    if (tabs.length === 0) handleNewFile();
  }, [tabs.length, handleNewFile]);

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <MainLayout
        onNewTab={handleNewFile}
        onCloseTab={handleCloseTab}
        onSave={handleSave}
        onOpenFile={handleOpenFile}
        onGotoLine={handleGotoLine}
        onExport={handleExport}
        onOpenEncoding={() => setShowEncodingDialog(true)}
        onOpenSettings={() => setShowSettingsDialog(true)}
      >
        {activeTab ? (
          showDiffView ? (
            <DiffEditorView original={diffContent.original} modified={diffContent.modified} language={activeTab.language} />
          ) : (
            <MonacoEditor
              key={activeTab.id}
              tabId={activeTab.id}
              path={activeTab.path}
              content={activeTab.content}
              language={activeTab.language}
              readonly={activeTab.readonly}
              onContentChange={handleContentChange}
              onCursorChange={handleCursorChange}
            />
          )
        ) : (
          <div className="no-tab">
            <div className="no-tab-content">
              <h2>MacPad</h2>
              <p>轻量化文本编辑器</p>
              <button className="btn btn-primary" onClick={handleNewFile}>新建文件</button>
            </div>
          </div>
        )}
      </MainLayout>

      {showEncodingDialog && activeTab && (
        <EncodingDialog currentEncoding={activeTab.encoding} onConfirm={handleEncodingChange} onClose={() => setShowEncodingDialog(false)} />
      )}
      {showSettingsDialog && <SettingsDialog onClose={() => setShowSettingsDialog(false)} />}
      {showGoToLineDialog && activeTab && (
        <GoToLineDialog maxLine={activeTab.meta?.line_count || 10000} onConfirm={handleGotoLineConfirm} onClose={() => setShowGoToLineDialog(false)} />
      )}
      {showMacroPanel && <MacroPanel onClose={() => setShowMacroPanel(false)} />}
      {reloadDialog && (
        <ReloadConfirmDialog fileName={getFileName(reloadDialog)} onReload={handleReload} onIgnore={() => setReloadDialog(null)} />
      )}
    </div>
  );
}
