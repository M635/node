import { useI18n } from "../../stores/i18nStore";

interface ShortcutsHelpProps {
  onClose: () => void;
}

export function ShortcutsHelp({ onClose }: ShortcutsHelpProps) {
  const { t } = useI18n();

  const SHORTCUTS: { category: string; keys: { key: string; desc: string }[] }[] = [
    {
      category: t("help.categoryFile"),
      keys: [
        { key: "Cmd+N", desc: t("action.new") },
        { key: "Cmd+O", desc: t("action.open") },
        { key: "Cmd+S", desc: t("action.save") },
        { key: "Cmd+W", desc: t("action.close") },
        { key: "Cmd+P", desc: t("help.cmdPalette") },
      ],
    },
    {
      category: t("help.categoryEdit"),
      keys: [
        { key: "Cmd+Z", desc: t("action.undo") },
        { key: "Cmd+Shift+Z", desc: t("action.redo") },
        { key: "Cmd+F", desc: t("action.find") },
        { key: "Cmd+Alt+F", desc: t("action.replace") },
        { key: "Cmd+G", desc: t("action.goto") },
        { key: "Cmd+Shift+F", desc: t("action.findInFiles") },
        { key: "Cmd+B", desc: t("help.toggleBookmark") },
        { key: "Cmd+Shift+B", desc: t("help.nextBookmark") },
      ],
    },
    {
      category: t("help.categoryView"),
      keys: [
        { key: "Cmd+\\", desc: t("help.toggleSidebar") },
        { key: "Cmd+Alt+D", desc: t("help.compare") },
        { key: "Cmd+M", desc: t("help.macro") },
        { key: "Cmd++", desc: t("help.zoomInFont") },
        { key: "Cmd+-", desc: t("help.zoomOutFont") },
      ],
    },
    {
      category: t("help.categoryMultiCursor"),
      keys: [
        { key: "Cmd+D", desc: t("help.selectNextMatch") },
        { key: "Cmd+Shift+L", desc: t("help.selectAllMatches") },
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
