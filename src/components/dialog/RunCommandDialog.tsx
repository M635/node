import { useState, useEffect } from "react";

interface RunCommandDialogProps {
  onClose: () => void;
  onRun: (command: string) => void;
}

export function RunCommandDialog({ onClose, onRun }: RunCommandDialogProps) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("markpt:run-history") || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleRun = () => {
    if (!command.trim()) return;
    onRun(command);
    const newHistory = [command, ...history.filter((h) => h !== command)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem("markpt:run-history", JSON.stringify(newHistory));
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog run-command-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>运行命令</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <input
            type="text"
            className="run-command-input"
            placeholder="输入命令..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRun(); }}
            autoFocus
          />
          {history.length > 0 && (
            <div className="run-command-history">
              <div className="run-history-header">历史命令</div>
              {history.map((cmd, i) => (
                <div
                  key={i}
                  className="run-history-item"
                  onClick={() => setCommand(cmd)}
                >
                  {cmd}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onClose}>取消</button>
          <button className="dialog-btn primary" onClick={handleRun}>运行</button>
        </div>
      </div>
    </div>
  );
}
