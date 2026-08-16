import { useState, useMemo } from "react";
import { useI18n } from "../../stores/i18nStore";

interface CsvViewerProps {
  content: string;
  onClose: () => void;
}

export function CsvViewer({ content, onClose }: CsvViewerProps) {
  const { t } = useI18n();
  const [delimiter, setDelimiter] = useState<"comma" | "tab" | "semicolon" | "pipe">("comma");
  const [hasHeader, setHasHeader] = useState(true);

  const { headers, rows } = useMemo(() => {
    const delim = delimiter === "comma" ? "," : delimiter === "tab" ? "\t" : delimiter === "semicolon" ? ";" : "|";
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length === 0) return { headers: [], rows: [] };

    const parseLine = (line: string): string[] => {
      const cells: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (char === delim && !inQuotes) {
          cells.push(current); current = "";
        } else {
          current += char;
        }
      }
      cells.push(current);
      return cells;
    };

    if (hasHeader) {
      const headers = parseLine(lines[0]);
      const rows = lines.slice(1).map(parseLine);
      return { headers, rows };
    }
    const maxCols = Math.max(...lines.map((l) => parseLine(l).length));
    const headers = Array.from({ length: maxCols }, (_, i) => t("csv.column", { n: i + 1 }));
    const rows = lines.map(parseLine);
    return { headers, rows };
  }, [content, delimiter, hasHeader, t]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog csv-viewer-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.csvViewer")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="csv-controls">
          <label>
            {t("csv.delimiter")}
            <select value={delimiter} onChange={(e) => setDelimiter(e.target.value as "comma" | "tab" | "semicolon" | "pipe")}>
              <option value="comma">{t("csv.comma")}</option>
              <option value="tab">{t("csv.tab")}</option>
              <option value="semicolon">{t("csv.semicolon")}</option>
              <option value="pipe">{t("csv.pipe")}</option>
            </select>
          </label>
          <label>
            <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />
            {t("csv.headerRow")}
          </label>
          <span className="csv-info">{t("csv.rowsCols", { rows: rows.length, cols: headers.length })}</span>
        </div>
        <div className="csv-table-container">
          <table className="csv-table">
            {hasHeader && headers.length > 0 && (
              <thead>
                <tr>
                  <th className="csv-row-num">#</th>
                  {headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  <td className="csv-row-num">{ri + 1}</td>
                  {headers.map((_, ci) => (
                    <td key={ci}>{row[ci] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
