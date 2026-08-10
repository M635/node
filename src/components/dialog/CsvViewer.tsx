import { useState, useMemo } from "react";

interface CsvViewerProps {
  content: string;
  onClose: () => void;
}

export function CsvViewer({ content, onClose }: CsvViewerProps) {
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
    const headers = Array.from({ length: maxCols }, (_, i) => `列 ${i + 1}`);
    const rows = lines.map(parseLine);
    return { headers, rows };
  }, [content, delimiter, hasHeader]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog csv-viewer-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>CSV/TSV 查看器</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="csv-controls">
          <label>
            分隔符:
            <select value={delimiter} onChange={(e) => setDelimiter(e.target.value as "comma" | "tab" | "semicolon" | "pipe")}>
              <option value="comma">逗号 (,)</option>
              <option value="tab">制表符 (\t)</option>
              <option value="semicolon">分号 (;)</option>
              <option value="pipe">竖线 (|)</option>
            </select>
          </label>
          <label>
            <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />
            首行为表头
          </label>
          <span className="csv-info">{rows.length} 行 × {headers.length} 列</span>
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
