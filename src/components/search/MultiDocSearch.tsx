import { useState, useCallback } from "react";
import { useFileStore } from "../../stores/fileStore";

interface MultiDocSearchProps {
  onClose: () => void;
}

interface SearchResult {
  tabId: string;
  tabName: string;
  matches: { line: number; column: number; text: string; preview: string }[];
}

export function MultiDocSearch({ onClose }: MultiDocSearchProps) {
  const { tabs, setActiveTab } = useFileStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(() => {
    if (!searchQuery) return;
    const flags = caseSensitive ? "g" : "gi";
    let regex: RegExp;
    try {
      regex = isRegex
        ? new RegExp(searchQuery, flags)
        : new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    } catch {
      return;
    }

    const searchResults: SearchResult[] = [];
    for (const tab of tabs) {
      const matches: SearchResult["matches"] = [];
      const lines = tab.content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(lines[i])) !== null) {
          const previewStart = Math.max(0, match.index - 20);
          const previewEnd = Math.min(lines[i].length, match.index + match[0].length + 20);
          matches.push({
            line: i + 1,
            column: match.index + 1,
            text: match[0],
            preview: (previewStart > 0 ? "..." : "") + lines[i].slice(previewStart, previewEnd) + (previewEnd < lines[i].length ? "..." : ""),
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      }
      if (matches.length > 0) {
        searchResults.push({ tabId: tab.id, tabName: tab.name, matches });
      }
    }
    setResults(searchResults);
  }, [searchQuery, caseSensitive, isRegex, tabs]);

  const handleReplaceAll = useCallback(() => {
    if (!searchQuery || !window.confirm("确认在所有打开的文件中替换？")) return;
    const flags = caseSensitive ? "g" : "gi";
    let regex: RegExp;
    try {
      regex = isRegex
        ? new RegExp(searchQuery, flags)
        : new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    } catch {
      return;
    }

    for (const tab of tabs) {
      const newContent = tab.content.replace(regex, replaceQuery);
      if (newContent !== tab.content) {
        useFileStore.getState().updateContent(tab.id, newContent);
      }
    }
    handleSearch();
  }, [searchQuery, replaceQuery, caseSensitive, isRegex, tabs, handleSearch]);

  const handleJumpTo = (tabId: string, line: number) => {
    setActiveTab(tabId);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("markpt:goto-line-confirm", { detail: { line } }));
    }, 100);
    onClose();
  };

  const toggleExpand = (tabId: string) => {
    setExpandedTabs((prev) => {
      const next = new Set(prev);
      if (next.has(tabId)) next.delete(tabId);
      else next.add(tabId);
      return next;
    });
  };

  const totalMatches = results.reduce((sum, r) => sum + r.matches.length, 0);

  return (
    <div className="multi-doc-search-overlay" onClick={onClose}>
      <div className="multi-doc-search" onClick={(e) => e.stopPropagation()}>
        <div className="multi-doc-search-header">
          <h3>多文档查找替换</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="multi-doc-search-input">
          <div className="search-row">
            <input
              type="text"
              placeholder="查找..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
            <button className="btn btn-small btn-primary" onClick={handleSearch}>查找全部</button>
          </div>
          <div className="search-row">
            <input
              type="text"
              placeholder="替换..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
            />
            <button className="btn btn-small" onClick={handleReplaceAll}>全部替换</button>
          </div>
          <div className="search-options">
            <label>
              <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
              区分大小写
            </label>
            <label>
              <input type="checkbox" checked={isRegex} onChange={(e) => setIsRegex(e.target.checked)} />
              正则表达式
            </label>
          </div>
        </div>
        <div className="multi-doc-search-summary">
          {totalMatches > 0 && `${results.length} 个文件中找到 ${totalMatches} 处匹配`}
        </div>
        <div className="multi-doc-search-results">
          {results.map((result) => (
            <div key={result.tabId} className="multi-doc-result-group">
              <div className="multi-doc-result-header" onClick={() => toggleExpand(result.tabId)}>
                <span className="expand-icon">{expandedTabs.has(result.tabId) ? "▼" : "▶"}</span>
                <span className="tab-name">{result.tabName}</span>
                <span className="match-count">{result.matches.length} 处匹配</span>
              </div>
              {expandedTabs.has(result.tabId) && (
                <div className="multi-doc-result-items">
                  {result.matches.map((match, idx) => (
                    <div
                      key={idx}
                      className="multi-doc-result-item"
                      onClick={() => handleJumpTo(result.tabId, match.line)}
                    >
                      <span className="match-line">行 {match.line}</span>
                      <span className="match-preview">{match.preview}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {results.length === 0 && searchQuery && (
            <div className="multi-doc-no-results">未找到匹配</div>
          )}
        </div>
      </div>
    </div>
  );
}
