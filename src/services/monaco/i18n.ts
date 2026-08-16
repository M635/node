import { MenuRegistry, MenuId, type ICommandAction } from "monaco-editor/esm/vs/platform/actions/common/actions.js";

type TFunc = (key: string) => string;

const BUILTIN_COMMAND_LABELS: Record<string, string> = {
  "editor.action.clipboardCutAction": "monaco.cut",
  "editor.action.clipboardCopyAction": "monaco.copy",
  "editor.action.clipboardPasteAction": "monaco.paste",
};

const BUILTIN_SUBMENU_LABELS: Record<string, string> = {
  [String(MenuId.EditorContextCopy)]: "monaco.copyAs",
  [String(MenuId.EditorContextShare)]: "monaco.share",
};

function applyTitle(command: ICommandAction | undefined, text: string): boolean {
  if (!command) return false;
  const title = command.title;
  if (typeof title === "string") {
    if (title === text) return false;
    command.title = text;
    return true;
  } else if (title && typeof title === "object" && "value" in title) {
    if (title.value === text) return false;
    title.value = text;
    return true;
  }
  return false;
}

function applySubmenuTitle(item: { submenu?: unknown; title?: string | { value: string } }, text: string): boolean {
  if (!item.submenu) return false;
  const title = item.title;
  if (typeof title === "string") {
    if (title === text) return false;
    item.title = text;
    return true;
  } else if (title && typeof title === "object" && "value" in title) {
    if (title.value === text) return false;
    title.value = text;
    return true;
  }
  return false;
}

/**
 * 本地化 Monaco 内置上下文菜单项（剪切/复制/粘贴/复制为/共享）的标题。
 * 直接修改 MenuRegistry 中已注册菜单项的 title 引用，避免中英文混杂。
 * 在编辑器挂载后与语言切换时调用。
 */
export function localizeBuiltinContextMenu(t: TFunc): void {
  try {
    const items = MenuRegistry.getMenuItems(MenuId.EditorContext);
    for (const item of items) {
      const cmdId = item.command?.id;
      if (cmdId && BUILTIN_COMMAND_LABELS[cmdId]) {
        applyTitle(item.command, t(BUILTIN_COMMAND_LABELS[cmdId]));
      }
      if (item.submenu) {
        const submenuKey = String(item.submenu);
        if (BUILTIN_SUBMENU_LABELS[submenuKey]) {
          applySubmenuTitle(item as unknown as { submenu?: unknown; title?: string | { value: string } }, t(BUILTIN_SUBMENU_LABELS[submenuKey]));
        }
      }
    }
  } catch {
    // 内部 API 不可用时静默降级，保留默认英文文案
  }
}
