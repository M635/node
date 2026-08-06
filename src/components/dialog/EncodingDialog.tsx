import { useState, useEffect } from "react";
import { ENCODING_LIST, getEncodingDisplayName } from "../../utils/encodingUtils";
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
          <h2>编码</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="dialog-current">
            当前编码: {getEncodingDisplayName(currentEncoding)}
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
          <button className="dialog-btn" onClick={onClose}>取消</button>
          <button
            className="dialog-btn primary"
            onClick={() => onConfirm(selected)}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
