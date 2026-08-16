/**
 * Monaco-editor 内部模块的类型声明。
 * 这些模块没有公开类型定义，仅用于本地化内置上下文菜单项的 title。
 * 运行时通过 ESM 子路径 import 访问，属于内部 API，随版本可能变化。
 */
declare module "monaco-editor/esm/vs/platform/actions/common/actions.js" {
  export interface ICommandAction {
    id: string;
    title: string | { value: string; original: string };
  }
  export interface IMenuItem {
    command?: ICommandAction;
    submenu?: unknown;
    group?: string;
    order?: number;
    when?: unknown;
    isHiddenByDefault?: boolean;
  }
  export const MenuRegistry: {
    getMenuItems(id: unknown): IMenuItem[];
  };
  export const MenuId: {
    EditorContext: unknown;
    SimpleEditorContext: unknown;
    CommandPalette: unknown;
    EditorContextCopy: unknown;
    EditorContextShare: unknown;
    [key: string]: unknown;
  };
}
