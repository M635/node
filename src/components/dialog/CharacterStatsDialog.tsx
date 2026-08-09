import { useEffect, useState } from "react";

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
  selection: { text: string; lines: number } | null;
  onClose: () => void;
}

export function CharacterStatsDialog({ content, selection, onClose }: CharacterStatsDialogProps) {
  const [stats, setStats] = useState<CharacterStats | null>(null);

  useEffect(() => {
    const chars = content.length;
    const charsNoSpaces = content.replace(/\s/g, "").length;
    const words = (content.match(/\S+/g) || []).length;
    const lines = content.split("\n").length;

    const selText = selection?.text || "";
    const selChars = selText.length;
    const selWords = (selText.match(/\S+/g) || []).length;
    const selLines = selection?.lines || 0;

    setStats({
      chars,
      chars_no_spaces: charsNoSpaces,
      words,
      lines,
      selected_chars: selChars,
      selected_words: selWords,
      selected_lines: selLines,
    });
  }, [content, selection]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog character-stats-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>字符统计</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {stats && (
            <>
              <div className="stats-section">
                <h4>全文统计</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">字符数</span>
                    <span className="stat-value">{stats.chars.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">字符数(不含空格)</span>
                    <span className="stat-value">{stats.chars_no_spaces.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">单词数</span>
                    <span className="stat-value">{stats.words.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">行数</span>
                    <span className="stat-value">{stats.lines.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {stats.selected_chars > 0 && (
                <div className="stats-section">
                  <h4>选区统计</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">选中字符</span>
                      <span className="stat-value">{stats.selected_chars.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">选中单词</span>
                      <span className="stat-value">{stats.selected_words.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">选中行</span>
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
