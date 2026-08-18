import { useEffect, useState } from "react";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface CharacterStats {
  chars: number;
  chars_no_spaces: number;
  words: number;
  lines: number;
  selected_chars: number;
  selected_words: number;
  selected_lines: number;
}

interface CharacterStatsDialogProps {
  content: string;
  selectedChars: number;
  selectedLines: number;
  selectedWords: number;
  onClose: () => void;
}

export function CharacterStatsDialog({ content, selectedChars, selectedLines, selectedWords, onClose }: CharacterStatsDialogProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [stats, setStats] = useState<CharacterStats | null>(null);

  useEffect(() => {
    const chars = content.length;
    const charsNoSpaces = content.replace(/\s/g, "").length;
    const words = (content.match(/\S+/g) || []).length;
    const lines = content.split("\n").length;

    setStats({
      chars,
      chars_no_spaces: charsNoSpaces,
      words,
      lines,
      selected_chars: selectedChars,
      selected_words: selectedWords,
      selected_lines: selectedLines,
    });
  }, [content, selectedChars, selectedLines, selectedWords]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog character-stats-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.charStats")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {stats && (
            <>
              <div className="stats-section">
                <h4>{t("stats.fullText")}</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">{t("stats.charsCount")}</span>
                    <span className="stat-value">{stats.chars.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t("stats.charsNoSpaces")}</span>
                    <span className="stat-value">{stats.chars_no_spaces.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t("stats.wordsCount")}</span>
                    <span className="stat-value">{stats.words.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t("stats.linesCount")}</span>
                    <span className="stat-value">{stats.lines.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {stats.selected_chars > 0 && (
                <div className="stats-section">
                  <h4>{t("stats.selection")}</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">{t("stats.selectedChars")}</span>
                      <span className="stat-value">{stats.selected_chars.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t("stats.selectedWords")}</span>
                      <span className="stat-value">{stats.selected_words.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t("stats.selectedLines")}</span>
                      <span className="stat-value">{stats.selected_lines.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
