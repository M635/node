import { useI18n } from "../../stores/i18nStore";

interface ShortcutMapperProps {
  onClose: () => void;
}

interface ShortcutItem {
  category: string;
  action: string;
  shortcut: string;
  description: string;
}

export function ShortcutMapper({ onClose }: ShortcutMapperProps) {
  const { t } = useI18n();

  const SHORTCUTS: ShortcutItem[] = [
    { category: "help.categoryFile", action: "action.new", shortcut: "Cmd/Ctrl+N", description: "action.new" },
    { category: "help.categoryFile", action: "action.open", shortcut: "Cmd/Ctrl+O", description: "action.open" },
    { category: "help.categoryFile", action: "action.save", shortcut: "Cmd/Ctrl+S", description: "action.save" },
    { category: "help.categoryFile", action: "action.close", shortcut: "Cmd/Ctrl+W", description: "action.close" },
    { category: "help.categorySearch", action: "action.find", shortcut: "Cmd/Ctrl+F", description: "action.find" },
    { category: "help.categorySearch", action: "action.replace", shortcut: "Cmd/Ctrl+H", description: "action.replace" },
    { category: "help.categorySearch", action: "action.goto", shortcut: "Cmd/Ctrl+G", description: "action.goto" },
    { category: "help.categorySearch", action: "action.findInFiles", shortcut: "Cmd/Ctrl+Shift+F", description: "action.findInFiles" },
    { category: "help.categorySearch", action: "mdFind.title", shortcut: "Cmd/Ctrl+Shift+F", description: "mdFind.title" },
    { category: "help.categoryEdit", action: "action.deleteLine", shortcut: "Cmd/Ctrl+D", description: "action.deleteLine" },
    { category: "help.categoryEdit", action: "action.duplicateLine", shortcut: "Shift+Alt+D", description: "action.duplicateLine" },
    { category: "help.categoryEdit", action: "action.moveUp", shortcut: "Alt+↑", description: "action.moveUp" },
    { category: "help.categoryEdit", action: "action.moveDown", shortcut: "Alt+↓", description: "action.moveDown" },
    { category: "help.categoryEdit", action: "action.toUpperCase", shortcut: "Cmd/Ctrl+Shift+U", description: "action.toUpperCase" },
    { category: "help.categoryEdit", action: "action.toLowerCase", shortcut: "Cmd/Ctrl+Shift+L", description: "action.toLowerCase" },
    { category: "help.categoryEdit", action: "action.toggleComment", shortcut: "Cmd/Ctrl+/", description: "action.toggleComment" },
    { category: "help.categoryEdit", action: "action.undo", shortcut: "Cmd/Ctrl+Z", description: "action.undo" },
    { category: "help.categoryEdit", action: "action.redo", shortcut: "Cmd/Ctrl+Shift+Z", description: "action.redo" },
    { category: "help.categoryView", action: "help.cmdPalette", shortcut: "Cmd/Ctrl+P", description: "help.cmdPalette" },
    { category: "help.categoryView", action: "help.toggleSidebar", shortcut: "Cmd/Ctrl+\\", description: "help.toggleSidebar" },
    { category: "help.categoryView", action: "dialog.functionList", shortcut: "Cmd/Ctrl+Shift+O", description: "dialog.functionList" },
    { category: "help.categoryView", action: "dialog.charStats", shortcut: "Cmd/Ctrl+Shift+C", description: "dialog.charStats" },
    { category: "help.categoryView", action: "dialog.hexViewer", shortcut: "Cmd/Ctrl+Shift+H", description: "dialog.hexViewer" },
    { category: "help.categoryView", action: "dialog.shortcutsHelp", shortcut: "Cmd/Ctrl+/", description: "dialog.shortcutsHelp" },
    { category: "cmd.category.tool", action: "dialog.encoding", shortcut: "—", description: "dialog.encoding" },
    { category: "cmd.category.tool", action: "dialog.settings", shortcut: "—", description: "dialog.settings" },
    { category: "cmd.category.tool", action: "dialog.macroPanel", shortcut: "—", description: "dialog.macroPanel" },
    { category: "cmd.category.tool", action: "cmd.compare", shortcut: "—", description: "cmd.compare" },
    { category: "editor.bookmark", action: "help.toggleBookmark", shortcut: "—", description: "help.toggleBookmark" },
    { category: "editor.bookmark", action: "help.nextBookmark", shortcut: "F2", description: "help.nextBookmark" },
    { category: "editor.bookmark", action: "help.prevBookmark", shortcut: "Shift+F2", description: "help.prevBookmark" },
    { category: "help.categoryMultiCursor", action: "help.addCursor", shortcut: "Cmd/Ctrl+Click", description: "help.addCursor" },
    { category: "help.categoryMultiCursor", action: "help.columnSelect", shortcut: "Shift+Alt+Drag", description: "help.columnSelect" },
    { category: "help.categoryMultiCursor", action: "action.findNext", shortcut: "F3", description: "action.findNext" },
    { category: "help.categoryMultiCursor", action: "action.findPrev", shortcut: "Shift+F3", description: "action.findPrev" },
  ];

  const grouped = SHORTCUTS.reduce<Record<string, ShortcutItem[]>>((acc, s) => {
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
        <div className="dialog-body">
          {categories.map((cat) => (
            <div key={cat} className="shortcut-category">
              <h4>{t(cat)}</h4>
              <table className="shortcut-table">
                <thead>
                  <tr>
                    <th>{t("help.operation")}</th>
                    <th>{t("help.shortcut")}</th>
                    <th>{t("help.description")}</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[cat].map((s, idx) => (
                    <tr key={idx}>
                      <td>{t(s.action)}</td>
                      <td><kbd>{s.shortcut}</kbd></td>
                      <td>{t(s.description)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
