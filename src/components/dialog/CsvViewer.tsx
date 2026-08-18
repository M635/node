import { useState, useMemo, useCallback } from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface CsvViewerProps {
  content: string;
  onClose: () => void;
}

type Delimiter = "comma" | "tab" | "semicolon" | "pipe";

export function CsvViewer({ content, onClose }: CsvViewerProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [delimiter, setDelimiter] = useState<Delimiter>("comma");
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

  const escapeCsvCell = (value: string, delim: string): string => {
    if (value.includes(delim) || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const handleExport = useCallback(async (format: "csv" | "tsv" | "json" | "html") => {
    const selected = await save({
      filters: [{ name: format.toUpperCase(), extensions: [format] }],
    });
    if (!selected) return;

    let output = "";
    if (format === "csv") {
      const delim = ",";
      const lines = [headers.map((h) => escapeCsvCell(h, delim)).join(delim)];
      for (const row of rows) {
        lines.push(headers.map((_, ci) => escapeCsvCell(row[ci] || "", delim)).join(delim));
      }
      output = lines.join("\n");
    } else if (format === "tsv") {
      const lines = [headers.join("\t")];
      for (const row of rows) {
        lines.push(headers.map((_, ci) => (row[ci] || "").replace(/\t/g, " ")).join("\t"));
      }
      output = lines.join("\n");
    } else if (format === "json") {
      const jsonRows = rows.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, ci) => { obj[h] = row[ci] || ""; });
        return obj;
      });
      output = JSON.stringify(jsonRows, null, 2);
    } else if (format === "html") {
      output = `<table>\n  <thead>\n    <tr>\n`;
      for (const h of headers) { output += `      <th>${h}</th>\n`; }
      output += `    </tr>\n  </thead>\n  <tbody>\n`;
      for (const row of rows) {
        output += `    <tr>\n`;
        for (const h of headers) {
          const ci = headers.indexOf(h);
          output += `      <td>${row[ci] || ""}</td>\n`;
        }
        output += `    </tr>\n`;
      }
      output += `  </tbody>\n</table>\n`;
    }

    try {
      await invoke("write_text_file", { path: selected, content: output });
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [headers, rows]);

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
            <select value={delimiter} onChange={(e) => setDelimiter(e.target.value as Delimiter)}>
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
          <div className="csv-export-buttons">
            <button className="btn btn-small" onClick={() => handleExport("csv")}>{t("csv.exportCsv")}</button>
            <button className="btn btn-small" onClick={() => handleExport("tsv")}>{t("csv.exportTsv")}</button>
            <button className="btn btn-small" onClick={() => handleExport("json")}>{t("csv.exportJson")}</button>
            <button className="btn btn-small" onClick={() => handleExport("html")}>{t("csv.exportHtml")}</button>
          </div>
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
