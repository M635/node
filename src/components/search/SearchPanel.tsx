import { useState, useCallback, useRef, useEffect } from "react";
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
    searchHistory,
    replaceHistory,
    addSearchHistory,
    addReplaceHistory,
    surroundMode,
    setSurroundMode,
    surroundChars,
    setSurroundChars,
    searchInSelection,
    setSearchInSelection,
  } = useSearchStore();

  const { getActiveTab } = useFileStore();
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showReplaceHistory, setShowReplaceHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery) {
      clearResults();
      return;
    }

    addSearchHistory(searchQuery);

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
    searchQuery, isRegex, caseSensitive, wholeWord,
    getActiveTab, setResults, clearResults, addSearchHistory,
  ]);

  const handleReplace = useCallback(async () => {
    if (!searchQuery || !replaceQuery) return;
    addReplaceHistory(replaceQuery);
    window.dispatchEvent(
      new CustomEvent("markpt:execute-replace", {
        detail: { search: searchQuery, replace: replaceQuery, isRegex, caseSensitive, surround: surroundMode ? surroundChars : null },
      })
    );
  }, [searchQuery, replaceQuery, isRegex, caseSensitive, surroundMode, surroundChars, addReplaceHistory]);

  const handleReplaceAll = useCallback(async () => {
    if (!searchQuery) return;
    addReplaceHistory(replaceQuery);
    window.dispatchEvent(
      new CustomEvent("markpt:execute-replace-all", {
        detail: { search: searchQuery, replace: replaceQuery, isRegex, caseSensitive, surround: surroundMode ? surroundChars : null },
      })
    );
  }, [searchQuery, replaceQuery, isRegex, caseSensitive, surroundMode, surroundChars, addReplaceHistory]);

  const handleSurroundSelection = useCallback(() => {
    if (!surroundMode) return;
    window.dispatchEvent(
      new CustomEvent("markpt:surround-selection", {
        detail: { open: surroundChars[0], close: surroundChars[1] },
      })
    );
  }, [surroundMode, surroundChars]);

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

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.search !== undefined) setSearchQuery(detail.search);
      if (detail?.replace !== undefined) setReplaceQuery(detail.replace);
    };
    window.addEventListener("markpt:set-search", handler);
    return () => window.removeEventListener("markpt:set-search", handler);
  }, [setSearchQuery, setReplaceQuery]);

  return (
    <div className="search-panel">
      <div className="search-row">
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="输入查找内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSearchHistory(true)}
            onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
            autoFocus
          />
          {showSearchHistory && searchHistory.length > 0 && (
            <div className="search-history-dropdown">
              {searchHistory.map((q, i) => (
                <div
                  key={i}
                  className="search-history-item"
                  onMouseDown={() => {
                    setSearchQuery(q);
                    setShowSearchHistory(false);
                  }}
                >
                  {q}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="search-btn" onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "..." : "查找"}
        </button>
        <button className="search-btn" onClick={prevMatch} disabled={searchResults.length === 0} title="上一个">↑</button>
        <button className="search-btn" onClick={nextMatch} disabled={searchResults.length === 0} title="下一个">↓</button>
        <button className={`search-toggle ${isRegex ? "active" : ""}`} onClick={toggleRegex} title="正则表达式">.*</button>
        <button className={`search-toggle ${caseSensitive ? "active" : ""}`} onClick={toggleCaseSensitive} title="区分大小写">Aa</button>
        <button className={`search-toggle ${wholeWord ? "active" : ""}`} onClick={toggleWholeWord} title="全词匹配">W</button>
        <button className={`search-toggle ${searchInSelection ? "active" : ""}`} onClick={() => setSearchInSelection(!searchInSelection)} title="选区内查找">≡</button>
        <button className={`search-toggle ${surroundMode ? "active" : ""}`} onClick={() => setSurroundMode(!surroundMode)} title="环绕搜索">⌐</button>
        <button className="search-toggle" onClick={toggleReplacePanel} title="展开替换">
          {isReplacePanelOpen ? "▾" : "▸"}
        </button>
      </div>
      {isReplacePanelOpen && (
        <div className="search-row">
          <div className="search-input-wrapper">
            <input
              ref={replaceInputRef}
              type="text"
              className="search-input"
              placeholder="替换为..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowReplaceHistory(true)}
              onBlur={() => setTimeout(() => setShowReplaceHistory(false), 200)}
            />
            {showReplaceHistory && replaceHistory.length > 0 && (
              <div className="search-history-dropdown">
                {replaceHistory.map((q, i) => (
                  <div
                    key={i}
                    className="search-history-item"
                    onMouseDown={() => {
                      setReplaceQuery(q);
                      setShowReplaceHistory(false);
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="search-btn" onClick={handleReplace}>替换</button>
          <button className="search-btn" onClick={handleReplaceAll}>全部替换</button>
        </div>
      )}
      {surroundMode && (
        <div className="search-row surround-row">
          <span className="surround-label">环绕字符:</span>
          <input
            type="text"
            className="surround-input"
            value={surroundChars[0]}
            onChange={(e) => setSurroundChars([e.target.value, surroundChars[1]])}
            placeholder="前"
          />
          <input
            type="text"
            className="surround-input"
            value={surroundChars[1]}
            onChange={(e) => setSurroundChars([surroundChars[0], e.target.value])}
            placeholder="后"
          />
          <button className="search-btn" onClick={handleSurroundSelection}>环绕选中</button>
          <button className="search-btn" onClick={() => setSurroundChars(["(", ")"])}>()</button>
          <button className="search-btn" onClick={() => setSurroundChars(["[", "]"])}>[]</button>
          <button className="search-btn" onClick={() => setSurroundChars(["{", "}"])}>{"{}"}</button>
          <button className="search-btn" onClick={() => setSurroundChars(['"', '"'])}>""</button>
          <button className="search-btn" onClick={() => setSurroundChars(["'", "'"])}>''</button>
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
