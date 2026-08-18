import { useState } from "react";
import { InsertUtils } from "../../services/text/insertUtils";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface InsertDateTimeDialogProps {
  onInsert: (text: string) => void;
  onClose: () => void;
}

export function InsertDateTimeDialog({ onInsert, onClose }: InsertDateTimeDialogProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [customFormat, setCustomFormat] = useState("YYYY-MM-DD HH:mm:ss");

  const formats: { label: string; value: string }[] = [
    { label: t("dt.short"), value: InsertUtils.dateTime("short") },
    { label: t("dt.long"), value: InsertUtils.dateTime("long") },
    { label: t("dt.iso"), value: InsertUtils.dateTime("iso") },
    { label: t("dt.timeOnly"), value: InsertUtils.dateTime("time") },
    { label: t("dt.dateOnly"), value: InsertUtils.dateTime("date") },
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog insert-datetime-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.insertDateTime")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="datetime-formats">
            {formats.map((f) => (
              <div key={f.label} className="datetime-item" onClick={() => { onInsert(f.value); onClose(); }}>
                <span className="datetime-label">{f.label}</span>
                <span className="datetime-value">{f.value}</span>
              </div>
            ))}
          </div>

          <div className="datetime-custom">
            <h4>{t("dt.custom")}</h4>
            <div className="custom-format-row">
              <input
                type="text"
                value={customFormat}
                onChange={(e) => setCustomFormat(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm:ss"
              />
              <button
                className="btn btn-primary"
                onClick={() => { onInsert(InsertUtils.dateTime("custom", customFormat)); onClose(); }}
              >
                {t("common.insert")}
              </button>
            </div>
            <div className="format-hint">
              {t("dt.hint")}
            </div>
            <div className="format-preview">
              {t("dt.preview", { value: InsertUtils.dateTime("custom", customFormat) })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
