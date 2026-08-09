import { useState, useCallback, useEffect, type DragEvent } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { MainLayout } from "./components/layout/MainLayout";
import { SideBar } from "./components/layout/SideBar";
import { MonacoEditor } from "./components/editor/MonacoEditor";
import { DiffEditorView } from "./components/editor/DiffEditor";
import { SplitEditor } from "./components/editor/SplitEditor";
import { HexViewer } from "./components/editor/HexViewer";
import { EncodingDialog } from "./components/dialog/EncodingDialog";
import { SettingsDialog } from "./components/dialog/SettingsDialog";
import { GoToLineDialog } from "./components/dialog/GoToLineDialog";
import { ReloadConfirmDialog } from "./components/dialog/ReloadConfirmDialog";
import { MacroPanel } from "./components/macro/MacroPanel";
import { CommandPalette } from "./components/dialog/CommandPalette";
import { ShortcutsHelp } from "./components/dialog/ShortcutsHelp";
import { CharacterStatsDialog } from "./components/dialog/CharacterStatsDialog";
import { FunctionListPanel } from "./components/dialog/FunctionListPanel";
import { MultiDocSearch } from "./components/search/MultiDocSearch";
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
import { saveSession, loadSession, type SessionData } from "./services/session/sessionService";
import type { EncodingType } from "./types/file";

export default function App() {
  const {
    tabs, activeTabId, openTab, closeTab, updateTab, updateContent, markClean, getActiveTab, addRecentFile, recentFiles,
  } = useFileStore();
  const { isDark, setIsDark, toggleBookmark } = useEditorStore();
  const { toggleSearchPanel, toggleReplacePanel, toggleFindInFiles } = useSearchStore();
  const { themeMode } = useSettingStore();

  const [showEncodingDialog, setShowEncodingDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showGoToLineDialog, setShowGoToLineDialog] = useState(false);
  const [showMacroPanel, setShowMacroPanel] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showDiffView, setShowDiffView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [diffContent, setDiffContent] = useState({ original: "", modified: "" });
  const [reloadDialog, setReloadDialog] = useState<string | null>(null);
  const [selectionInfo, setSelectionInfo] = useState<{ chars: number; lines: number } | null>(null);
  const [showCharStats, setShowCharStats] = useState(false);
  const [showFunctionList, setShowFunctionList] = useState(false);
  const [showHexViewer, setShowHexViewer] = useState(false);
  const [showMultiDocSearch, setShowMultiDocSearch] = useState(false);
  const [splitMode, setSplitMode] = useState<"horizontal" | "vertical" | null>(null);

  const themeResult = useTheme(themeMode);
  useEffect(() => { setIsDark(themeResult.isDark); }, [themeResult.isDark, setIsDark]);

  const activeTab = getActiveTab();

  const openFileByPath = useCallback(async (path: string) => {
    try {
      const result = await openFileService(path);
      openTab({
        id: generateId(), path, name: getFileName(path), content: result.content,
        meta: result.meta, is_dirty: false, is_large_file: result.is_large_file,
        readonly: result.meta.readonly, encoding: result.meta.encoding,
        language: getLanguageFromPath(path),
        cursor_position: { line: 1, column: 1 }, scroll_position: 0, is_new: false,
      });
      addRecentFile(path);
    } catch (err) {
      alert(`打开文件失败: ${err}`);
    }
  }, [openTab, addRecentFile]);

  const handleNewFile = useCallback(() => {
    openTab({
      id: generateId(), path: "", name: "未命名", content: "", meta: null,
      is_dirty: false, is_large_file: false, readonly: false,
      encoding: "UTF-8", language: "plaintext",
      cursor_position: { line: 1, column: 1 }, scroll_position: 0, is_new: true,
    });
  }, [openTab]);

  const handleOpenFile = useCallback(async () => {
    const selected = await open({ multiple: true, filters: [{ name: "所有文件", extensions: ["*"] }] });
    if (!selected) return;
    const paths = Array.isArray(selected) ? selected : [selected];
    for (const p of paths) {
      await openFileByPath(p as string);
    }
  }, [openFileByPath]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const tab = getActiveTab();
      if (tab?.is_dirty && tab.path && !tab.is_new && !tab.readonly) {
        saveFileService(tab.path, tab.content, tab.encoding).then(() => {
          markClean(tab.id);
        }).catch(() => {});
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [getActiveTab, markClean]);

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
        try { await saveFileService(savePath, tab.content, tab.encoding); } catch { /* ignore */ }
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

  const handleSelectionChange = useCallback((chars: number, lines: number) => {
    setSelectionInfo(chars > 0 ? { chars, lines } : null);
  }, []);

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
    window.dispatchEvent(new CustomEvent("markpt:goto-line-confirm", { detail: { line } }));
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

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as File & { path?: string };
        if (file.path) {
          openFileByPath(file.path);
        }
      }
    }
  }, [openFileByPath]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.path && detail?.line) {
        const tab = useFileStore.getState().getTabByPath(detail.path);
        if (tab) {
          useFileStore.getState().setActiveTab(tab.id);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("markpt:goto-line-confirm", { detail: { line: detail.line } }));
          }, 100);
        } else {
          openFileByPath(detail.path).then(() => {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("markpt:goto-line-confirm", { detail: { line: detail.line } }));
            }, 200);
          });
        }
      }
    };
    window.addEventListener("markpt:open-search-result", handler);
    return () => window.removeEventListener("markpt:open-search-result", handler);
  }, [openFileByPath]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        setShowCommandPalette((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setShowSidebar((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcutsHelp(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setShowMultiDocSearch(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "H") {
        e.preventDefault();
        setShowHexViewer(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        setShowCharStats(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "O") {
        e.preventDefault();
        setShowFunctionList(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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
    onToggleSidebar: () => setShowSidebar((v) => !v),
    onCommandPalette: () => setShowCommandPalette(true),
    onShortcutsHelp: () => setShowShortcutsHelp(true),
    onEditAction: (action: string) => {
      if (action === "undo") { window.dispatchEvent(new CustomEvent("markpt:edit-undo")); return; }
      if (action === "redo") { window.dispatchEvent(new CustomEvent("markpt:edit-redo")); return; }
      window.dispatchEvent(new CustomEvent("markpt:edit-action", { detail: { action } }));
    },
    onSplitHorizontal: () => setSplitMode(splitMode === "horizontal" ? null : "horizontal"),
    onSplitVertical: () => setSplitMode(splitMode === "vertical" ? null : "vertical"),
    onSplitClose: () => setSplitMode(null),
    onFunctionList: () => setShowFunctionList((v) => !v),
    onToggleWordWrap: () => useSettingStore.getState().setWordWrap(!useSettingStore.getState().wordWrap),
    onCharStats: () => setShowCharStats(true),
    onHexViewer: () => setShowHexViewer(true),
    onMultiDocSearch: () => setShowMultiDocSearch(true),
  });

  useEffect(() => {
    if (tabs.length === 0) handleNewFile();
  }, [tabs.length, handleNewFile]);

  // 会话保存（退出时）
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const sessionData: SessionData = {
        tabs: tabs.filter((t) => !t.is_new && t.path).map((t) => ({
          path: t.path,
          name: t.name,
          cursor_line: t.cursor_position.line,
          cursor_column: t.cursor_position.column,
          scroll_position: t.scroll_position,
          encoding: t.encoding,
          language: t.language || "plaintext",
        })),
        active_tab_path: activeTab?.path || null,
        sidebar_visible: showSidebar,
        window_width: window.innerWidth,
        window_height: window.innerHeight,
        saved_at: Date.now(),
      };
      saveSession(sessionData).catch(() => {});
    }, 60000);
    return () => clearInterval(saveInterval);
  }, [tabs, activeTab, showSidebar]);

  // 会话恢复（启动时）
  useEffect(() => {
    (async () => {
      const session = await loadSession();
      if (session && session.tabs.length > 0) {
        for (const tab of session.tabs) {
          try {
            const result = await openFileService(tab.path);
            openTab({
              id: generateId(), path: tab.path, name: tab.name, content: result.content,
              meta: result.meta, is_dirty: false, is_large_file: result.is_large_file,
              readonly: result.meta.readonly, encoding: tab.encoding as EncodingType,
              language: tab.language,
              cursor_position: { line: tab.cursor_line, column: tab.cursor_column },
              scroll_position: tab.scroll_position, is_new: false,
            });
          } catch { /* ignore */ }
        }
        if (session.active_tab_path) {
          const tab = useFileStore.getState().getTabByPath(session.active_tab_path);
          if (tab) useFileStore.getState().setActiveTab(tab.id);
        }
        setShowSidebar(session.sidebar_visible);
      }
    })();
  }, []);

  return (
    <div className={`app ${isDark ? "dark" : "light"}`} onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="app-body">
        {showSidebar && (
          <div className="sidebar-container">
            <SideBar onOpenFile={openFileByPath} />
            {recentFiles.length > 0 && (
              <div className="recent-files">
                <div className="recent-files-header">最近打开</div>
                {recentFiles.slice(0, 10).map((path) => (
                  <div key={path} className="recent-file-item" onClick={() => openFileByPath(path)} title={path}>
                    {getFileName(path)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <MainLayout
          onNewTab={handleNewFile}
          onCloseTab={handleCloseTab}
          onSave={handleSave}
          onOpenFile={handleOpenFile}
          onGotoLine={handleGotoLine}
          onExport={handleExport}
          onOpenEncoding={() => setShowEncodingDialog(true)}
          onOpenSettings={() => setShowSettingsDialog(true)}
          selectionInfo={selectionInfo}
        >
          {activeTab ? (
            showDiffView ? (
              <DiffEditorView original={diffContent.original} modified={diffContent.modified} language={activeTab.language} />
            ) : splitMode ? (
              <SplitEditor
                content={activeTab.content}
                path={activeTab.path}
                language={activeTab.language}
                orientation={splitMode}
                onContentChange={handleContentChange}
                onClose={() => setSplitMode(null)}
              />
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
                onSelectionChange={handleSelectionChange}
              />
            )
          ) : (
            <div className="no-tab">
              <div className="no-tab-content">
                <h2>MarkPT</h2>
                <p>轻量化文本编辑器</p>
                <button className="btn btn-primary" onClick={handleNewFile}>新建文件</button>
                <button className="btn btn-default" onClick={handleOpenFile}>打开文件</button>
                <p className="hint">拖拽文件到此处打开 · Cmd+P 命令面板</p>
              </div>
            </div>
          )}
        </MainLayout>
      </div>

      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onSave={handleSave}
          onNewFile={handleNewFile}
          onOpenFile={handleOpenFile}
          onGotoLine={handleGotoLine}
          onFind={toggleSearchPanel}
          onReplace={toggleReplacePanel}
          onFindInFiles={toggleFindInFiles}
          onEncoding={() => setShowEncodingDialog(true)}
          onSettings={() => setShowSettingsDialog(true)}
          onToggleDiff={handleToggleDiff}
          onToggleMacro={() => setShowMacroPanel(true)}
        />
      )}
      {showEncodingDialog && activeTab && (
        <EncodingDialog currentEncoding={activeTab.encoding} onConfirm={handleEncodingChange} onClose={() => setShowEncodingDialog(false)} />
      )}
      {showSettingsDialog && <SettingsDialog onClose={() => setShowSettingsDialog(false)} />}
      {showGoToLineDialog && activeTab && (
        <GoToLineDialog maxLine={activeTab.meta?.line_count || 10000} onConfirm={handleGotoLineConfirm} onClose={() => setShowGoToLineDialog(false)} />
      )}
      {showMacroPanel && <MacroPanel onClose={() => setShowMacroPanel(false)} />}
      {showShortcutsHelp && <ShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}
      {showCharStats && activeTab && (
        <CharacterStatsDialog
          content={activeTab.content}
          selectedChars={selectionInfo?.chars || 0}
          selectedLines={selectionInfo?.lines || 0}
          onClose={() => setShowCharStats(false)}
        />
      )}
      {showFunctionList && (
        <FunctionListPanel
          editor={(window as any).monaco?.editor?.getEditors?.()[0] || null}
          onClose={() => setShowFunctionList(false)}
        />
      )}
      {showHexViewer && activeTab && (
        <HexViewer content={activeTab.content} onClose={() => setShowHexViewer(false)} />
      )}
      {showMultiDocSearch && (
        <MultiDocSearch onClose={() => setShowMultiDocSearch(false)} />
      )}
      {reloadDialog && (
        <ReloadConfirmDialog fileName={getFileName(reloadDialog)} onReload={handleReload} onIgnore={() => setReloadDialog(null)} />
      )}
    </div>
  );
}
