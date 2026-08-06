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
