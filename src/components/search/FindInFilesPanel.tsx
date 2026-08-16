import { useState, useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useSearchStore } from "../../stores/searchStore";
import { useI18n } from "../../stores/i18nStore";
import { findInFiles } from "../../services/tauri/searchService";
import { describeError } from "../../utils/errors";
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
  const { t } = useI18n();

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
      // 用户可见提示走中文弹窗，原始错误进调试日志
      console.debug("[MarkPT][调试] 全局搜索失败:", err);
      alert(`${t("search.findInFiles")}：${describeError(err)}`);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, directory, extensions, isRegex, caseSensitive, setResults, t]);

  const handleClose = () => {
    useSearchStore.getState().toggleFindInFiles();
    clearResults();
  };

  return (
    <div className="find-in-files-panel">
      <div className="panel-header">
        <span>{t("search.findInFiles")}</span>
        <button className="panel-close" onClick={handleClose}>×</button>
      </div>
      <div className="panel-body">
        <div className="panel-row">
          <input
            type="text"
            className="panel-input"
            placeholder={t("search.findContentPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            className={`panel-toggle ${isRegex ? "active" : ""}`}
            onClick={toggleRegex}
            title={t("search.regex")}
          >
            .*
          </button>
          <button
            className={`panel-toggle ${caseSensitive ? "active" : ""}`}
            onClick={toggleCaseSensitive}
            title={t("search.caseSensitive")}
          >
            Aa
          </button>
        </div>
        <div className="panel-row">
          <input
            type="text"
            className="panel-input"
            placeholder={t("search.dirPlaceholder")}
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
          />
          <button className="panel-btn" onClick={handleSelectDirectory}>
            {t("common.browse")}
          </button>
        </div>
        <div className="panel-row">
          <input
            type="text"
            className="panel-input"
            placeholder={t("search.extPlaceholder")}
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
            {isSearching ? t("search.searching") : t("search.find")}
          </button>
        </div>
        <SearchResults />
      </div>
    </div>
  );
}
