import { useState, useEffect, useRef, useMemo } from "react";
import { useI18n } from "../../stores/i18nStore";

interface HexViewerProps {
  content: string;
  onClose: () => void;
}

const BYTES_PER_LINE = 16;
const MAX_BYTES = 1024 * 1024;

export function HexViewer({ content, onClose }: HexViewerProps) {
  const { t } = useI18n();
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [gotoOffset, setGotoOffset] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const allBytes = useMemo(() => {
    const encoder = new TextEncoder();
    return encoder.encode(content.slice(0, MAX_BYTES));
  }, [content]);
  const totalBytes = allBytes.length;
  const linesPerPage = 200;
  const bytesPerPage = linesPerPage * BYTES_PER_LINE;
  const pageData = allBytes.slice(offset, offset + bytesPerPage);

  const lines: { hex: string[]; ascii: string; addr: number }[] = [];
  for (let i = 0; i < pageData.length; i += BYTES_PER_LINE) {
    const lineBytes = Array.from(pageData.slice(i, i + BYTES_PER_LINE));
    const hex = lineBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
    const ascii = lineBytes.map((b) => (b >= 32 && b < 127) ? String.fromCharCode(b) : ".").join("");
    lines.push({ hex, ascii, addr: offset + i });
  }

  const handleSearch = () => {
    if (!search) return;
    const searchBytes = new TextEncoder().encode(search);
    for (let i = 0; i < allBytes.length - searchBytes.length; i++) {
      let found = true;
      for (let j = 0; j < searchBytes.length; j++) {
        if (allBytes[i + j] !== searchBytes[j]) { found = false; break; }
      }
      if (found) {
        const newOffset = Math.floor(i / bytesPerPage) * bytesPerPage;
        setOffset(newOffset);
        return;
      }
    }
    alert(t("hex.notFound"));
  };

  const handleGoto = () => {
    const target = parseInt(gotoOffset, 16);
    if (isNaN(target) || target < 0 || target >= totalBytes) return;
    setOffset(Math.floor(target / bytesPerPage) * bytesPerPage);
    setGotoOffset("");
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="hex-viewer-overlay" onClick={onClose}>
      <div className="hex-viewer" onClick={(e) => e.stopPropagation()} ref={containerRef}>
        <div className="hex-viewer-header">
          <h3>{t("dialog.hexViewer")}</h3>
          <div className="hex-search">
            <input
              type="text"
              placeholder={t("hex.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-small" onClick={handleSearch}>{t("hex.find")}</button>
          </div>
          <div className="hex-goto">
            <input
              type="text"
              placeholder={t("hex.gotoOffset")}
              value={gotoOffset}
              onChange={(e) => setGotoOffset(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGoto()}
              style={{ width: 80 }}
            />
            <button className="btn btn-small" onClick={handleGoto}>{t("hex.goto")}</button>
          </div>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="hex-viewer-info">
          {t("hex.info", {
            total: totalBytes.toLocaleString(),
            offset: offset.toString(16).toUpperCase(),
            shown: pageData.length,
          })}
        </div>
        <div className="hex-viewer-body">
          <div className="hex-line hex-header-line">
            <span className="hex-addr">{t("hex.address")}</span>
            <span className="hex-bytes">00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
            <span className="hex-ascii">ASCII</span>
          </div>
          {lines.map((line, idx) => (
            <div key={idx} className="hex-line">
              <span className="hex-addr">{line.addr.toString(16).padStart(8, "0").toUpperCase()}</span>
              <span className="hex-bytes">
                {line.hex.slice(0, 8).join(" ")}
                {"  "}
                {line.hex.slice(8).join(" ")}
              </span>
              <span className="hex-ascii">{line.ascii}</span>
            </div>
          ))}
        </div>
        <div className="hex-viewer-footer">
          <button className="btn btn-small" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - bytesPerPage))}>
            {t("hex.prevPage")}
          </button>
          <button className="btn btn-small" disabled={offset + bytesPerPage >= totalBytes} onClick={() => setOffset(offset + bytesPerPage)}>
            {t("hex.nextPage")}
          </button>
        </div>
      </div>
    </div>
  );
}
