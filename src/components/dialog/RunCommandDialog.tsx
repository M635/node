import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useI18n } from "../../stores/i18nStore";

interface CommandOutput {
  exit_code: number;
  stdout: string;
  stderr: string;
  timed_out: boolean;
}

interface RunCommandDialogProps {
  onClose: () => void;
}

export function RunCommandDialog({ onClose }: RunCommandDialogProps) {
  const { t } = useI18n();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("markpt:run-history") || "[]");
    } catch { return []; }
  });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CommandOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleRun = async () => {
    const cmd = command.trim();
    if (!cmd) {
      setErrorMessage(t("rc.emptyCommand"));
      return;
    }
    setRunning(true);
    setResult(null);
    setErrorMessage(null);
    try {
      // 后端执行命令并捕获输出；命令超时会自动终止
      const output = await invoke<CommandOutput>("run_command", { command: cmd });
      setResult(output);
    } catch (err) {
      setErrorMessage(String(err));
      console.debug("[MarkPT][调试] 运行命令失败:", err);
    } finally {
      setRunning(false);
    }
    const newHistory = [cmd, ...history.filter((h) => h !== cmd)].slice(0, 20);
    setHistory(newHistory);
    try {
      localStorage.setItem("markpt:run-history", JSON.stringify(newHistory));
    } catch { /* 忽略存储失败 */ }
  };

  const handleCopyOutput = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.stdout + result.stderr).catch(() => {});
  };

  const handleInsertOutput = () => {
    if (!result) return;
    window.dispatchEvent(
      new CustomEvent("markpt:insert-text", { detail: { text: result.stdout || result.stderr } })
    );
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog run-command-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{t("dialog.runCommand")}</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <input
            type="text"
            className="run-command-input"
            placeholder={t("rc.placeholder")}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRun(); }}
            autoFocus
          />
          {history.length > 0 && (
            <div className="run-command-history">
              <div className="run-history-header">{t("rc.history")}</div>
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
          {errorMessage && (
            <div className="run-command-error">{t("rc.runFailed")}：{errorMessage}</div>
          )}
          {(running || result) && (
            <div className="run-command-output">
              {running ? (
                <div className="run-command-running">{t("rc.running")}</div>
              ) : result ? (
                <>
                  <div className="run-output-meta">
                    <span>{t("rc.exitCode", { code: result.exit_code })}</span>
                    {result.timed_out && <span className="run-timed-out">{t("rc.timedOut")}</span>}
                  </div>
                  {result.stderr && (
                    <div className="run-output-section">
                      <div className="run-output-title">{t("rc.errorOutput")}</div>
                      <pre className="run-output-pre run-output-stderr">{result.stderr}</pre>
                    </div>
                  )}
                  <div className="run-output-section">
                    <div className="run-output-title">{t("rc.output")}</div>
                    <pre className="run-output-pre">{result.stdout || t("rc.noOutput")}</pre>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
        <div className="dialog-footer">
          {result && !running && (
            <>
              <button className="dialog-btn" onClick={handleCopyOutput}>{t("rc.copyOutput")}</button>
              <button className="dialog-btn" onClick={handleInsertOutput}>{t("rc.insertOutput")}</button>
            </>
          )}
          <button className="dialog-btn" onClick={onClose}>{t("common.cancel")}</button>
          <button className="dialog-btn primary" onClick={handleRun} disabled={running}>
            {running ? t("rc.running") : t("common.run")}
          </button>
        </div>
      </div>
    </div>
  );
}
