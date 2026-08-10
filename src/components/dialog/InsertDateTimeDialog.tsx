import { useState } from "react";
import { InsertUtils } from "../../services/text/insertUtils";

interface InsertDateTimeDialogProps {
  onInsert: (text: string) => void;
  onClose: () => void;
}

export function InsertDateTimeDialog({ onInsert, onClose }: InsertDateTimeDialogProps) {
  const [customFormat, setCustomFormat] = useState("YYYY-MM-DD HH:mm:ss");

  const formats: { label: string; value: string; format: "short" | "long" | "iso" | "time" | "date" | "custom" }[] = [
    { label: "短日期时间", value: InsertUtils.dateTime("short"), format: "short" },
    { label: "长日期时间", value: InsertUtils.dateTime("long"), format: "long" },
    { label: "ISO 格式", value: InsertUtils.dateTime("iso"), format: "iso" },
    { label: "仅时间", value: InsertUtils.dateTime("time"), format: "time" },
    { label: "仅日期", value: InsertUtils.dateTime("date"), format: "date" },
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog insert-datetime-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>插入日期时间</h3>
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
            <h4>自定义格式</h4>
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
                插入
              </button>
            </div>
            <div className="format-hint">
              可用变量: YYYY(年) MM(月) DD(日) HH(时) mm(分) ss(秒) SSS(毫秒)
            </div>
            <div className="format-preview">
              预览: {InsertUtils.dateTime("custom", customFormat)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
