import { useState, useEffect } from "react";
import { useI18n } from "../../stores/i18nStore";

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
  const { t } = useI18n();
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
          <h2>{t("dialog.gotoLine")}</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="dialog-info">{t("dialog.gotoTotalLines", { total: maxLine })}</div>
          <input
            type="number"
            className="dialog-input"
            min="1"
            max={maxLine}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("dialog.gotoPlaceholder")}
            autoFocus
          />
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onClose}>{t("common.cancel")}</button>
          <button
            className="dialog-btn primary"
            onClick={handleConfirm}
            disabled={!value || parseInt(value) < 1 || parseInt(value) > maxLine}
          >
            {t("dialog.gotoJump")}
          </button>
        </div>
      </div>
    </div>
  );
}
