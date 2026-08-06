import { useState, useEffect } from "react";

interface GoToLineDialogProps {
  maxLine: number;
  onConfirm: (line: number) => void;
  onClose: () => void;
}

export function GoToLineDialog({
  maxLine,
  onConfirm,
  onClose,
}: GoToLineDialogProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        const line = parseInt(value);
        if (line > 0 && line <= maxLine) {
          onConfirm(line);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, maxLine, onConfirm, onClose]);

  const handleConfirm = () => {
    const line = parseInt(value);
    if (line > 0 && line <= maxLine) {
      onConfirm(line);
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog goto-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>跳转到行</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="dialog-info">共 {maxLine} 行</div>
          <input
            type="number"
            className="dialog-input"
            min="1"
            max={maxLine}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="行号"
            autoFocus
          />
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onClose}>取消</button>
          <button
            className="dialog-btn primary"
            onClick={handleConfirm}
            disabled={!value || parseInt(value) < 1 || parseInt(value) > maxLine}
          >
            跳转
          </button>
        </div>
      </div>
    </div>
  );
}
