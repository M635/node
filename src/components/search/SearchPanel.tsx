import { useState, useCallback } from "react";
import { useSearchStore } from "../../stores/searchStore";
import { useFileStore } from "../../stores/fileStore";
import { searchInFile } from "../../services/tauri/searchService";

export function SearchPanel() {
  const {
    searchQuery,
    replaceQuery,
    isRegex,
    caseSensitive,
    wholeWord,
    setSearchQuery,
    setReplaceQuery,
    toggleRegex,
    toggleCaseSensitive,
    toggleWholeWord,
    toggleReplacePanel,
    isReplacePanelOpen,
    clearResults,
    setResults,
    nextMatch,
    prevMatch,
    searchResults,
    currentMatchIndex,
    totalMatches,
  } = useSearchStore();

  const { getActiveTab } = useFileStore();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery) {
      clearResults();
      return;
    }

    const tab = getActiveTab();
    if (!tab || !tab.path) return;

    setIsSearching(true);
    try {
      let pattern = searchQuery;
      if (wholeWord && !isRegex) {
        pattern = `\\b${pattern}\\b`;
      }
      const summary = await searchInFile(
        tab.path,
        pattern,
        isRegex || wholeWord,
        caseSensitive
      );
      setResults(summary);
    } catch (err) {
      console.error("搜索失败:", err);
    } finally {
      setIsSearching(false);
    }
  }, [
    searchQuery,
    isRegex,
    caseSensitive,
    wholeWord,
    getActiveTab,
    setResults,
    clearResults,
  ]);

  const handleReplace = useCallback(async () => {
    if (!searchQuery || !replaceQuery) return;
    window.dispatchEvent(
      new CustomEvent("macpad:execute-replace", {
        detail: { search: searchQuery, replace: replaceQuery, isRegex, caseSensitive },
      })
    );
  }, [searchQuery, replaceQuery, isRegex, caseSensitive]);

  const handleReplaceAll = useCallback(async () => {
    if (!searchQuery) return;
    window.dispatchEvent(
      new CustomEvent("macpad:execute-replace-all", {
        detail: { search: searchQuery, replace: replaceQuery, isRegex, caseSensitive },
      })
    );
  }, [searchQuery, replaceQuery, isRegex, caseSensitive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        prevMatch();
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      useSearchStore.getState().closeAllPanels();
    }
  };

  return (
    <div className="search-panel">
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="查找..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="search-btn" onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "..." : "查找"}
        </button>
        <button
          className="search-btn"
          onClick={prevMatch}
          disabled={searchResults.length === 0}
          title="上一个"
        >
          ↑
        </button>
        <button
          className="search-btn"
          onClick={nextMatch}
          disabled={searchResults.length === 0}
          title="下一个"
        >
          ↓
        </button>
        <button
          className={`search-toggle ${isRegex ? "active" : ""}`}
          onClick={toggleRegex}
          title="正则表达式"
        >
          .*
        </button>
        <button
          className={`search-toggle ${caseSensitive ? "active" : ""}`}
          onClick={toggleCaseSensitive}
          title="区分大小写"
        >
          Aa
        </button>
        <button
          className={`search-toggle ${wholeWord ? "active" : ""}`}
          onClick={toggleWholeWord}
          title="全词匹配"
        >
          W
        </button>
        <button
          className="search-toggle"
          onClick={toggleReplacePanel}
          title="展开替换"
        >
          {isReplacePanelOpen ? "▾" : "▸"}
        </button>
      </div>
      {isReplacePanelOpen && (
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="替换为..."
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" onClick={handleReplace}>
            替换
          </button>
          <button className="search-btn" onClick={handleReplaceAll}>
            全部替换
          </button>
        </div>
      )}
      {totalMatches > 0 && (
        <div className="search-info">
          {currentMatchIndex + 1} / {totalMatches} 个匹配
        </div>
      )}
    </div>
  );
}
