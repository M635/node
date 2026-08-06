import { useState, useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useSearchStore } from "../../stores/searchStore";
import { findInFiles } from "../../services/tauri/searchService";
import { SearchResults } from "./SearchResults";

export function FindInFilesPanel() {
  const {
    searchQuery,
    isRegex,
    caseSensitive,
    setSearchQuery,
    toggleRegex,
    toggleCaseSensitive,
    setResults,
    clearResults,
  } = useSearchStore();

  const [directory, setDirectory] = useState("");
  const [extensions, setExtensions] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSelectDirectory = async () => {
    const selected = await open({ directory: true });
    if (selected) {
      setDirectory(selected as string);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery || !directory) return;

    setIsSearching(true);
    try {
      const extList = extensions
        ? extensions.split(",").map((e) => e.trim()).filter(Boolean)
        : undefined;
      const summary = await findInFiles(
        directory,
        searchQuery,
        isRegex,
        caseSensitive,
        extList
      );
      setResults(summary);
    } catch (err) {
      console.error("全局搜索失败:", err);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, directory, extensions, isRegex, caseSensitive, setResults]);

  const handleClose = () => {
    useSearchStore.getState().toggleFindInFiles();
    clearResults();
  };

  return (
    <div className="find-in-files-panel">
      <div className="panel-header">
        <span>在文件中查找</span>
        <button className="panel-close" onClick={handleClose}>×</button>
      </div>
      <div className="panel-body">
        <div className="panel-row">
          <input
            type="text"
            className="panel-input"
            placeholder="查找内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            className={`panel-toggle ${isRegex ? "active" : ""}`}
            onClick={toggleRegex}
            title="正则"
          >
            .*
          </button>
          <button
            className={`panel-toggle ${caseSensitive ? "active" : ""}`}
            onClick={toggleCaseSensitive}
            title="区分大小写"
          >
            Aa
          </button>
        </div>
        <div className="panel-row">
          <input
            type="text"
            className="panel-input"
            placeholder="目录..."
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
          />
          <button className="panel-btn" onClick={handleSelectDirectory}>
            浏览...
          </button>
        </div>
        <div className="panel-row">
          <input
            type="text"
            className="panel-input"
            placeholder="文件扩展名 (逗号分隔, 如: ts,js,txt)"
            value={extensions}
            onChange={(e) => setExtensions(e.target.value)}
          />
        </div>
        <div className="panel-row">
          <button
            className="panel-btn primary"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery || !directory}
          >
            {isSearching ? "搜索中..." : "搜索"}
          </button>
        </div>
        <SearchResults />
      </div>
    </div>
  );
}
