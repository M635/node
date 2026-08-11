import { useEffect } from "react";
import { useClipboardStore } from "../../stores/clipboardStore";

interface ClipboardHistoryPanelProps {
  onPaste: (text: string) => void;
  onClose: () => void;
}

export function ClipboardHistoryPanel({ onPaste, onClose }: ClipboardHistoryPanelProps) {
  const { history, clearHistory } = useClipboardStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog clipboard-history-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>剪贴板历史</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {history.length === 0 ? (
            <div className="clipboard-empty">暂无剪贴板历史</div>
          ) : (
            <div className="clipboard-list">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="clipboard-item"
                  onClick={() => { onPaste(item.text); onClose(); }}
                >
                  <span className="clipboard-item-index">{i + 1}</span>
                  <span className="clipboard-item-text">
                    {item.text.length > 100 ? item.text.slice(0, 100) + "..." : item.text}
                  </span>
                  <span className="clipboard-item-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={clearHistory}>清空历史</button>
          <button className="dialog-btn primary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
