import { useState, useMemo } from "react";
import { InsertUtils } from "../../services/text/insertUtils";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface SpecialCharPanelProps {
  onInsert: (char: string) => void;
  onClose: () => void;
}

const CATEGORY_KEYS: Record<string, string> = {
  "控制": "specialChar.cat.control",
  "箭头": "specialChar.cat.arrow",
  "数学": "specialChar.cat.math",
  "符号": "specialChar.cat.symbol",
  "货币": "specialChar.cat.currency",
  "数字": "specialChar.cat.number",
  "图形": "specialChar.cat.figure",
};

export function SpecialCharPanel({ onInsert, onClose }: SpecialCharPanelProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [filter, setFilter] = useState("");
  const allChars = useMemo(() => InsertUtils.specialCharacters(), []);

  const categories = useMemo(() => {
    const cats = new Set(allChars.map((c) => c.category));
    return Array.from(cats);
  }, [allChars]);

  const categoryLabel = (category: string): string => {
    const key = CATEGORY_KEYS[category];
    return key ? t(key) : category;
  };

  const filtered = filter
    ? allChars.filter((c) => c.name.includes(filter) || c.char.includes(filter))
    : allChars;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog special-char-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.specialChar")}</h3>
          <input
            type="text"
            className="special-char-filter"
            placeholder={t("common.searchPlaceholder")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {categories.map((cat) => {
            const chars = filtered.filter((c) => c.category === cat);
            if (chars.length === 0) return null;
            return (
              <div key={cat} className="char-category">
                <h4>{categoryLabel(cat)}</h4>
                <div className="char-grid">
                  {chars.map((c, idx) => (
                    <button
                      key={`${c.name}-${idx}`}
                      className="char-item"
                      title={c.name}
                      onClick={() => onInsert(c.char)}
                    >
                      <span className="char-symbol">{c.char === "\n" ? "\\n" : c.char === "\t" ? "\\t" : c.char === "\r" ? "\\r" : c.char === " " ? "␣" : c.char}</span>
                      <span className="char-name">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
