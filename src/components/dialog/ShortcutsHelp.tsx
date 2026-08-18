import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface ShortcutsHelpProps {
  onClose: () => void;
}

export function ShortcutsHelp({ onClose }: ShortcutsHelpProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const mod = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "Cmd" : "Ctrl";

  const SHORTCUTS: { category: string; keys: { key: string; desc: string }[] }[] = [
    {
      category: t("help.categoryFile"),
      keys: [
        { key: `${mod}+N`, desc: t("action.new") },
        { key: `${mod}+O`, desc: t("action.open") },
        { key: `${mod}+S`, desc: t("action.save") },
        { key: `${mod}+W`, desc: t("action.close") },
        { key: `${mod}+P`, desc: t("help.cmdPalette") },
      ],
    },
    {
      category: t("help.categoryEdit"),
      keys: [
        { key: `${mod}+Z`, desc: t("action.undo") },
        { key: `${mod}+Shift+Z`, desc: t("action.redo") },
        { key: `${mod}+F`, desc: t("action.find") },
        { key: `${mod}+Alt+F`, desc: t("action.replace") },
        { key: `${mod}+G`, desc: t("action.goto") },
        { key: `${mod}+Shift+F`, desc: t("action.findInFiles") },
        { key: `${mod}+B`, desc: t("help.toggleBookmark") },
        { key: `${mod}+Shift+B`, desc: t("help.nextBookmark") },
      ],
    },
    {
      category: t("help.categoryView"),
      keys: [
        { key: `${mod}+\\`, desc: t("help.toggleSidebar") },
        { key: `${mod}+Alt+D`, desc: t("help.compare") },
        { key: `${mod}+M`, desc: t("help.macro") },
        { key: `${mod}++`, desc: t("help.zoomInFont") },
        { key: `${mod}+-`, desc: t("help.zoomOutFont") },
      ],
    },
    {
      category: t("help.categoryMultiCursor"),
      keys: [
        { key: `${mod}+D`, desc: t("help.selectNextMatch") },
        { key: `${mod}+Shift+L`, desc: t("help.selectAllMatches") },
        { key: "Alt+Click", desc: t("help.addCursor") },
        { key: "Shift+Alt+Drag", desc: t("help.columnSelect") },
      ],
    },
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{t("dialog.shortcutsHelp")}</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          {SHORTCUTS.map((group) => (
            <div key={group.category} className="shortcut-group">
              <h3>{group.category}</h3>
              {group.keys.map((item) => (
                <div key={item.key} className="shortcut-row">
                  <span className="shortcut-desc">{item.desc}</span>
                  <span className="shortcut-key">{item.key}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
