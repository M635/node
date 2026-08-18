import { useState } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { useFileStore } from "../../stores/fileStore";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface BookmarkListPanelProps {
  onClose: () => void;
}

export function BookmarkListPanel({ onClose }: BookmarkListPanelProps) {
  const { t } = useI18n();
  const { bookmarks, clearBookmarks, toggleBookmark } = useEditorStore();
  const { tabs, activeTabId, setActiveTab } = useFileStore();
  const [filter, setFilter] = useState("");

  useEscapeClose(onClose);

  const allBookmarks: { tabId: string; tabName: string; line: number }[] = [];
  for (const [tabId, lines] of bookmarks) {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) continue;
    for (const line of lines) {
      allBookmarks.push({ tabId, tabName: tab.name, line });
    }
  }

  const filtered = filter
    ? allBookmarks.filter((b) =>
        b.tabName.toLowerCase().includes(filter.toLowerCase()) ||
        String(b.line).includes(filter)
      )
    : allBookmarks;

  const handleJump = (tabId: string, line: number) => {
    if (tabId !== activeTabId) setActiveTab(tabId);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("markpt:goto-line-confirm", { detail: { line } }));
    }, 50);
    onClose();
  };

  const handleRemove = (tabId: string, line: number) => {
    toggleBookmark(tabId, line);
  };

  const handleClearAll = () => {
    for (const tabId of bookmarks.keys()) {
      clearBookmarks(tabId);
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog bookmark-list-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("editor.bookmark")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="bookmark-list-toolbar">
            <input
              type="text"
              placeholder={t("common.filterPlaceholder")}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
            />
            <button className="btn btn-small" onClick={handleClearAll} disabled={allBookmarks.length === 0}>
              {t("common.delete")}
            </button>
          </div>
          <div className="bookmark-list-items">
            {filtered.length === 0 ? (
              <div className="sidebar-empty">{t("bookmark.empty")}</div>
            ) : (
              filtered.map((bm, idx) => (
                <div
                  key={`${bm.tabId}-${bm.line}-${idx}`}
                  className="bookmark-list-item"
                  onClick={() => handleJump(bm.tabId, bm.line)}
                >
                  <span className="bookmark-icon">🔵</span>
                  <span className="bookmark-tab-name">{bm.tabName}</span>
                  <span className="bookmark-line">{t("fnList.line", { n: bm.line })}</span>
                  <button
                    className="bookmark-remove-btn"
                    onClick={(e) => { e.stopPropagation(); handleRemove(bm.tabId, bm.line); }}
                    title={t("common.delete")}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="bookmark-list-summary">
            {t("bookmark.total", { n: allBookmarks.length })}
          </div>
        </div>
      </div>
    </div>
  );
}
