import { useState, useCallback, useEffect, useRef } from "react";
import { useI18n } from "../../stores/i18nStore";
import { useSettingStore } from "../../stores/settingStore";

interface ShortcutMapperProps {
  onClose: () => void;
}

interface ShortcutItem {
  category: string;
  action: string;
  shortcut: string;
  description: string;
  actionId: string;
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { category: "help.categoryFile", action: "action.new", shortcut: "Cmd/Ctrl+N", description: "action.new", actionId: "new" },
  { category: "help.categoryFile", action: "action.open", shortcut: "Cmd/Ctrl+O", description: "action.open", actionId: "open" },
  { category: "help.categoryFile", action: "action.save", shortcut: "Cmd/Ctrl+S", description: "action.save", actionId: "save" },
  { category: "help.categoryFile", action: "action.close", shortcut: "Cmd/Ctrl+W", description: "action.close", actionId: "close" },
  { category: "help.categorySearch", action: "action.find", shortcut: "Cmd/Ctrl+F", description: "action.find", actionId: "find" },
  { category: "help.categorySearch", action: "action.replace", shortcut: "Cmd/Ctrl+H", description: "action.replace", actionId: "replace" },
  { category: "help.categorySearch", action: "action.goto", shortcut: "Cmd/Ctrl+G", description: "action.goto", actionId: "goto" },
  { category: "help.categorySearch", action: "action.findInFiles", shortcut: "Cmd/Ctrl+Shift+F", description: "action.findInFiles", actionId: "findInFiles" },
  { category: "help.categoryEdit", action: "action.deleteLine", shortcut: "Cmd/Ctrl+D", description: "action.deleteLine", actionId: "deleteLine" },
  { category: "help.categoryEdit", action: "action.duplicateLine", shortcut: "Shift+Alt+D", description: "action.duplicateLine", actionId: "duplicateLine" },
  { category: "help.categoryEdit", action: "action.moveUp", shortcut: "Alt+↑", description: "action.moveUp", actionId: "moveUp" },
  { category: "help.categoryEdit", action: "action.moveDown", shortcut: "Alt+↓", description: "action.moveDown", actionId: "moveDown" },
  { category: "help.categoryEdit", action: "action.toUpperCase", shortcut: "Cmd/Ctrl+Shift+U", description: "action.toUpperCase", actionId: "toUpperCase" },
  { category: "help.categoryEdit", action: "action.toLowerCase", shortcut: "Cmd/Ctrl+Shift+L", description: "action.toLowerCase", actionId: "toLowerCase" },
  { category: "help.categoryEdit", action: "action.toggleComment", shortcut: "Cmd/Ctrl+/", description: "action.toggleComment", actionId: "toggleComment" },
  { category: "help.categoryEdit", action: "action.undo", shortcut: "Cmd/Ctrl+Z", description: "action.undo", actionId: "undo" },
  { category: "help.categoryEdit", action: "action.redo", shortcut: "Cmd/Ctrl+Shift+Z", description: "action.redo", actionId: "redo" },
  { category: "help.categoryView", action: "help.cmdPalette", shortcut: "Cmd/Ctrl+P", description: "help.cmdPalette", actionId: "cmdPalette" },
  { category: "help.categoryView", action: "help.toggleSidebar", shortcut: "Cmd/Ctrl+\\", description: "help.toggleSidebar", actionId: "toggleSidebar" },
  { category: "help.categoryView", action: "dialog.functionList", shortcut: "Cmd/Ctrl+Shift+O", description: "dialog.functionList", actionId: "functionList" },
  { category: "help.categoryView", action: "dialog.charStats", shortcut: "Cmd/Ctrl+Shift+C", description: "dialog.charStats", actionId: "charStats" },
  { category: "help.categoryView", action: "dialog.hexViewer", shortcut: "Cmd/Ctrl+Shift+H", description: "dialog.hexViewer", actionId: "hexViewer" },
];

function keyEventToShortcut(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("Cmd/Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  const key = e.key;
  if (!["Control", "Meta", "Shift", "Alt"].includes(key)) {
    parts.push(key.length === 1 ? key.toUpperCase() : key);
  }
  return parts.join("+");
}

export function ShortcutMapper({ onClose }: ShortcutMapperProps) {
  const { t } = useI18n();
  const { customShortcuts, setCustomShortcut, resetCustomShortcut, resetAllCustomShortcuts } = useSettingStore();
  const [capturingAction, setCapturingAction] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const getShortcut = useCallback((item: ShortcutItem): string => {
    return customShortcuts[item.actionId] ?? item.shortcut;
  }, [customShortcuts]);

  const handleKeyCapture = useCallback((e: KeyboardEvent) => {
    if (!capturingAction) return;
    if (["Control", "Meta", "Shift", "Alt"].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const shortcut = keyEventToShortcut(e);
    setCustomShortcut(capturingAction, shortcut);
    setCapturingAction(null);
  }, [capturingAction, setCustomShortcut]);

  useEffect(() => {
    if (capturingAction) {
      window.addEventListener("keydown", handleKeyCapture, true);
      return () => window.removeEventListener("keydown", handleKeyCapture, true);
    }
  }, [capturingAction, handleKeyCapture]);

  const grouped = DEFAULT_SHORTCUTS.reduce<Record<string, ShortcutItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});
  const categories = Object.keys(grouped);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog shortcut-mapper-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.shortcutMapper")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body" ref={captureRef}>
          <div className="shortcut-mapper-info">
            <span>{t("shortcut.clickToReassign")}</span>
            <button className="btn btn-secondary" onClick={resetAllCustomShortcuts}>
              {t("shortcut.resetAll")}
            </button>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="shortcut-category">
              <h4>{t(cat)}</h4>
              <table className="shortcut-table">
                <thead>
                  <tr>
                    <th>{t("help.operation")}</th>
                    <th>{t("help.shortcut")}</th>
                    <th>{t("help.description")}</th>
                    <th>{t("shortcut.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[cat].map((s, idx) => {
                    const current = getShortcut(s);
                    const isCustom = customShortcuts[s.actionId] !== undefined;
                    const isCapturing = capturingAction === s.actionId;
                    return (
                      <tr key={idx} className={isCustom ? "custom-shortcut" : ""}>
                        <td>{t(s.action)}</td>
                        <td>
                          {isCapturing ? (
                            <span className="capturing-hint">{t("shortcut.pressKeys")}</span>
                          ) : (
                            <kbd>{current}</kbd>
                          )}
                        </td>
                        <td>{t(s.description)}</td>
                        <td>
                          <button
                            className="btn btn-small"
                            onClick={() => setCapturingAction(s.actionId)}
                          >
                            {t("shortcut.reassign")}
                          </button>
                          {isCustom && (
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => resetCustomShortcut(s.actionId)}
                            >
                              {t("shortcut.reset")}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
