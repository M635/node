import type { DragEvent } from "react";
import type { FileTab } from "../../types/file";
import { truncatePath } from "../../utils/fileUtils";

interface TabItemProps {
  tab: FileTab;
  active: boolean;
  dragOver: boolean;
  onClick: () => void;
  onClose: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const languageColors: Record<string, string> = {
  javascript: "#f0db4f",
  typescript: "#3178c6",
  python: "#3776ab",
  rust: "#dea584",
  java: "#ed8b00",
  c: "#5599ff",
  cpp: "#659ad2",
  go: "#00add8",
  ruby: "#cc342d",
  php: "#777bb4",
  swift: "#fa7343",
  kotlin: "#7f52ff",
  html: "#e34c26",
  css: "#264de4",
  json: "#cbcb41",
  xml: "#e3791a",
  markdown: "#773",
  sql: "#e38c00",
  shell: "#89e051",
  yaml: "#cb171e",
  plaintext: "#999",
};

function getTabColor(tab: FileTab): string | undefined {
  if (tab.is_new) return undefined;
  return languageColors[tab.language];
}

export function TabItem({
  tab,
  active,
  dragOver,
  onClick,
  onClose,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onContextMenu,
}: TabItemProps) {
  const title = tab.is_new ? "未命名" : truncatePath(tab.path, 30);
  const color = getTabColor(tab);

  return (
    <div
      className={`tab-item ${active ? "active" : ""} ${dragOver ? "drag-over" : ""} ${tab.readonly ? "readonly" : ""}`}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      draggable
      title={tab.path || "未命名"}
    >
      {color && (
        <span className="tab-color-dot" style={{ background: color }} />
      )}
      <span className="tab-icon">
        {tab.readonly && "🔒"}
        {tab.is_large_file && "📦"}
      </span>
      <span className="tab-name">{tab.name || title}</span>
      {tab.is_dirty && <span className="tab-dirty">●</span>}
      <button
        className="tab-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        title="关闭"
      >
        ×
      </button>
    </div>
  );
}
