import { useState, useEffect } from "react";

interface RunMacroDialogProps {
  onClose: () => void;
  onRun: (times: number) => void;
}

export function RunMacroDialog({ onClose, onRun }: RunMacroDialogProps) {
  const [times, setTimes] = useState(1);
  const [untilEnd, setUntilEnd] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleRun = () => {
    onRun(untilEnd ? -1 : times);
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog run-macro-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>多次运行宏</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="settings-row">
            <label>运行次数</label>
            <input
              type="number"
              min="1"
              max="10000"
              value={times}
              onChange={(e) => setTimes(parseInt(e.target.value) || 1)}
              disabled={untilEnd}
            />
          </div>
          <div className="settings-row">
            <label>运行到文件末尾</label>
            <input
              type="checkbox"
              checked={untilEnd}
              onChange={(e) => setUntilEnd(e.target.checked)}
            />
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onClose}>取消</button>
          <button className="dialog-btn primary" onClick={handleRun}>运行</button>
        </div>
      </div>
    </div>
  );
}
