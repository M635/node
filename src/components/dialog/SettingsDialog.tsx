import { useState, useEffect } from "react";
import { useSettingStore } from "../../stores/settingStore";
import type { ThemeMode } from "../../types/theme";

interface SettingsDialogProps {
  onClose: () => void;
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const {
    fontSize,
    fontFamily,
    tabSize,
    insertSpaces,
    wordWrap,
    showLineNumbers,
    showWhitespace,
    showMinimap,
    themeMode,
    autoIndent,
    bracketPairColorization,
    folding,
    setFontSize,
    setFontFamily,
    setTabSize,
    setInsertSpaces,
    setWordWrap,
    setShowLineNumbers,
    setShowWhitespace,
    setShowMinimap,
    setThemeMode,
    setAutoIndent,
    setBracketPairColorization,
    setFolding,
    resetToDefaults,
  } = useSettingStore();

  const [localFontSize, setLocalFontSize] = useState(fontSize);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog settings-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>设置</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="settings-section">
            <h3>字体</h3>
            <div className="settings-row">
              <label>字号</label>
              <input
                type="number"
                min="8"
                max="32"
                value={localFontSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 14;
                  setLocalFontSize(v);
                  setFontSize(v);
                }}
              />
            </div>
            <div className="settings-row">
              <label>字体族</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="'SF Mono', 'Menlo', monospace">SF Mono</option>
                <option value="'Menlo', monospace">Menlo</option>
                <option value="'Monaco', monospace">Monaco</option>
                <option value="'Consolas', monospace">Consolas</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="monospace">系统默认</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>编辑器</h3>
            <div className="settings-row">
              <label>Tab 大小</label>
              <select value={tabSize} onChange={(e) => setTabSize(parseInt(e.target.value))}>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </div>
            <div className="settings-row">
              <label>空格缩进</label>
              <input
                type="checkbox"
                checked={insertSpaces}
                onChange={(e) => setInsertSpaces(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>自动换行</label>
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>显示行号</label>
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>显示空白字符</label>
              <input
                type="checkbox"
                checked={showWhitespace}
                onChange={(e) => setShowWhitespace(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>显示小地图</label>
              <input
                type="checkbox"
                checked={showMinimap}
                onChange={(e) => setShowMinimap(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>代码折叠</label>
              <input
                type="checkbox"
                checked={folding}
                onChange={(e) => setFolding(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>括号配对着色</label>
              <input
                type="checkbox"
                checked={bracketPairColorization}
                onChange={(e) => setBracketPairColorization(e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>自动缩进</label>
              <input
                type="checkbox"
                checked={autoIndent}
                onChange={(e) => setAutoIndent(e.target.checked)}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>主题</h3>
            <div className="settings-row">
              <label>主题模式</label>
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
              >
                <option value="auto">跟随系统</option>
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={resetToDefaults}>
            恢复默认
          </button>
          <button className="dialog-btn primary" onClick={onClose}>
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
