import { useState, useMemo, useRef } from "react";
import { useI18n } from "../../stores/i18nStore";
import { useSettingStore } from "../../stores/settingStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";
import type { FileTab } from "../../types/file";

interface PrintPreviewDialogProps {
  tab: FileTab;
  onClose: () => void;
}

export function PrintPreviewDialog({ tab, onClose }: PrintPreviewDialogProps) {
  const { t } = useI18n();
  const { tabSize } = useSettingStore();
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEscapeClose(onClose);

  const { html, lineCount } = useMemo(() => {
    const lines = tab.content.split("\n");
    const count = lines.length;
    const escaped = tab.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const numbered = showLineNumbers
      ? escaped.split("\n").map((line, i) => {
          const num = String(i + 1).padStart(String(count).length, " ");
          return `<span class="line-num">${num}</span>${line}`;
        }).join("\n")
      : escaped;
    const header = showHeader
      ? `<h1>${tab.name}</h1><div class="meta">${tab.path || t("common.unnamed")} | ${tab.encoding} | ${count} ${t("statusbar.line")}</div>`
      : "";
    const footer = showFooter
      ? `<div class="footer">${tab.name} - ${new Date().toLocaleString()}</div>`
      : "";
    const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${tab.name}</title>
<style>
@page { size: ${orientation === "portrait" ? "A4 portrait" : "A4 landscape"}; margin: ${margin}mm; }
body { font-family: 'Courier New', monospace; font-size: ${fontSize}px; line-height: 1.5; margin: 0; }
h1 { font-size: ${fontSize + 4}px; margin-bottom: 8px; }
pre { white-space: pre-wrap; tab-size: ${tabSize}; }
.meta { color: #666; font-size: ${fontSize - 2}px; margin-bottom: 16px; }
.footer { color: #999; font-size: ${fontSize - 2}px; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 8px; }
.line-num { color: #999; display: inline-block; width: ${String(count).length + 1}ch; margin-right: 8px; user-select: none; }
</style></head><body>
${header}
<pre>${numbered}</pre>
${footer}
</body></html>`;
    return { html: fullHtml, lineCount: count };
  }, [tab, fontSize, margin, showLineNumbers, orientation, showHeader, showFooter, tabSize, t]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog print-preview-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("print.preview")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="print-preview-body">
          <div className="print-preview-options">
            <label>
              <span>{t("print.fontSize")}</span>
              <input type="number" min={8} max={24} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value) || 12)} />
            </label>
            <label>
              <span>{t("print.margin")}</span>
              <input type="number" min={0} max={50} value={margin} onChange={(e) => setMargin(Number(e.target.value) || 20)} />
              <span>mm</span>
            </label>
            <label>
              <span>{t("print.orientation")}</span>
              <select value={orientation} onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}>
                <option value="portrait">{t("print.portrait")}</option>
                <option value="landscape">{t("print.landscape")}</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={showLineNumbers} onChange={(e) => setShowLineNumbers(e.target.checked)} />
              {t("print.lineNumbers")}
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)} />
              {t("print.header")}
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={showFooter} onChange={(e) => setShowFooter(e.target.checked)} />
              {t("print.footer")}
            </label>
          </div>
          <div className="print-preview-content">
            <iframe ref={previewRef} srcDoc={html} title="Print Preview" className="print-preview-iframe" />
          </div>
        </div>
        <div className="dialog-footer">
          <span className="print-info">{t("print.lineCount", { n: lineCount })}</span>
          <button className="btn btn-small" onClick={onClose}>{t("common.close")}</button>
          <button className="btn btn-small btn-primary" onClick={handlePrint}>{t("print.print")}</button>
        </div>
      </div>
    </div>
  );
}
