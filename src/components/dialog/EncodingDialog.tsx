import { useState, useEffect } from "react";
import { ENCODING_LIST, getEncodingDisplayName } from "../../utils/encodingUtils";
import { useI18n } from "../../stores/i18nStore";
import type { EncodingType } from "../../types/file";

interface EncodingDialogProps {
  currentEncoding: EncodingType;
  onConfirm: (encoding: EncodingType) => void;
  onClose: () => void;
}

export function EncodingDialog({
  currentEncoding,
  onConfirm,
  onClose,
}: EncodingDialogProps) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<EncodingType>(currentEncoding);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm(selected);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, onConfirm, onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog encoding-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{t("dialog.encoding")}</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="dialog-current">
            {t("dialog.encodingCurrent", { encoding: getEncodingDisplayName(currentEncoding) })}
          </div>
          <div className="encoding-list">
            {ENCODING_LIST.map((enc) => (
              <button
                key={enc}
                className={`encoding-option ${selected === enc ? "active" : ""}`}
                onClick={() => setSelected(enc)}
              >
                {getEncodingDisplayName(enc)}
              </button>
            ))}
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onClose}>{t("common.cancel")}</button>
          <button
            className="dialog-btn primary"
            onClick={() => onConfirm(selected)}
          >
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
