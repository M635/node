import { create } from "zustand";

export type Language = "zh" | "en";

const translations: Record<string, Record<Language, string>> = {
  "app.title": { zh: "MarkPT", en: "MarkPT" },
  "app.subtitle": { zh: "轻量化文本编辑器", en: "Lightweight Text Editor" },
  "app.newFile": { zh: "新建文件", en: "New File" },
  "app.openFile": { zh: "打开文件", en: "Open File" },
  "app.hint": { zh: "拖拽文件到此处打开 · Cmd+P 命令面板", en: "Drag files here · Cmd+P Command Palette" },

  "menu.file": { zh: "文件", en: "File" },
  "menu.edit": { zh: "编辑", en: "Edit" },
  "menu.search": { zh: "搜索", en: "Search" },
  "menu.tools": { zh: "工具", en: "Tools" },
  "menu.view": { zh: "视图", en: "View" },
  "menu.help": { zh: "帮助", en: "Help" },

  "action.save": { zh: "保存", en: "Save" },
  "action.saveAs": { zh: "另存为...", en: "Save As..." },
  "action.saveCopy": { zh: "保存副本...", en: "Save a Copy..." },
  "action.open": { zh: "打开...", en: "Open..." },
  "action.openWithEncoding": { zh: "按编码打开...", en: "Open with Encoding..." },
  "action.new": { zh: "新建", en: "New" },
  "action.close": { zh: "关闭标签", en: "Close Tab" },
  "action.quit": { zh: "退出 MarkPT", en: "Quit MarkPT" },

  "action.undo": { zh: "撤销", en: "Undo" },
  "action.redo": { zh: "重做", en: "Redo" },
  "action.deleteLine": { zh: "删除当前行", en: "Delete Current Line" },
  "action.duplicateLine": { zh: "复制当前行", en: "Duplicate Current Line" },
  "action.moveUp": { zh: "上移行", en: "Move Line Up" },
  "action.moveDown": { zh: "下移行", en: "Move Line Down" },
  "action.deleteBlank": { zh: "删除空行", en: "Delete Blank Lines" },
  "action.trimTrailing": { zh: "去行尾空格", en: "Trim Trailing Whitespace" },
  "action.toggleComment": { zh: "切换注释", en: "Toggle Comment" },
  "action.toUpperCase": { zh: "转大写", en: "To Uppercase" },
  "action.toLowerCase": { zh: "转小写", en: "To Lowercase" },
  "action.sortAsc": { zh: "行排序(升序)", en: "Sort Lines (Asc)" },
  "action.sortDesc": { zh: "行排序(降序)", en: "Sort Lines (Desc)" },
  "action.removeDuplicates": { zh: "去重复行", en: "Remove Duplicate Lines" },

  "action.find": { zh: "查找...", en: "Find..." },
  "action.replace": { zh: "替换...", en: "Replace..." },
  "action.goto": { zh: "跳转到行...", en: "Go to Line..." },
  "action.findInFiles": { zh: "在文件中查找...", en: "Find in Files..." },
  "action.findNext": { zh: "查找下一个", en: "Find Next" },
  "action.findPrev": { zh: "查找上一个", en: "Find Previous" },

  "action.encoding": { zh: "编码...", en: "Encoding..." },
  "action.settings": { zh: "设置...", en: "Settings..." },
  "action.charStats": { zh: "字符统计...", en: "Character Stats..." },
  "action.hexViewer": { zh: "十六进制查看...", en: "Hex Viewer..." },

  "status.saved": { zh: "✓ 已保存", en: "✓ Saved" },
  "status.modified": { zh: "● 已修改", en: "● Modified" },
  "status.readonly": { zh: "只读", en: "Read-only" },
  "status.insert": { zh: "插入", en: "Insert" },
  "status.overwrite": { zh: "覆盖", en: "Overwrite" },
  "status.words": { zh: "词", en: "words" },
  "status.chars": { zh: "字符", en: "chars" },
  "status.lines": { zh: "行", en: "lines" },
  "status.selected": { zh: "已选", en: "Selected" },

  "search.placeholder": { zh: "查找...", en: "Find..." },
  "search.replacePlaceholder": { zh: "替换为...", en: "Replace with..." },
  "search.find": { zh: "查找", en: "Find" },
  "search.replace": { zh: "替换", en: "Replace" },
  "search.replaceAll": { zh: "全部替换", en: "Replace All" },
  "search.matches": { zh: "个匹配", en: "matches" },
  "search.regex": { zh: "正则表达式", en: "Regex" },
  "search.caseSensitive": { zh: "区分大小写", en: "Case Sensitive" },
  "search.wholeWord": { zh: "全词匹配", en: "Whole Word" },
  "search.inSelection": { zh: "选区内查找", en: "In Selection" },
  "search.surround": { zh: "环绕搜索", en: "Surround" },
  "search.history": { zh: "搜索历史", en: "Search History" },

  "tab.new": { zh: "新建标签", en: "New Tab" },
  "tab.sortByName": { zh: "按名称排序", en: "Sort by Name" },
  "tab.sortByPath": { zh: "按路径排序", en: "Sort by Path" },
  "tab.sortByType": { zh: "按类型排序", en: "Sort by Type" },
  "tab.sortBySize": { zh: "按大小排序", en: "Sort by Size" },
  "tab.list": { zh: "标签列表", en: "Tab List" },
  "tab.filterPlaceholder": { zh: "过滤标签...", en: "Filter tabs..." },

  "dialog.settings": { zh: "设置", en: "Settings" },
  "dialog.settings.font": { zh: "字体", en: "Font" },
  "dialog.settings.editor": { zh: "编辑器", en: "Editor" },
  "dialog.settings.save": { zh: "保存", en: "Save" },
  "dialog.settings.theme": { zh: "主题", en: "Theme" },
  "dialog.settings.fontSize": { zh: "字号", en: "Font Size" },
  "dialog.settings.fontFamily": { zh: "字体族", en: "Font Family" },
  "dialog.settings.tabSize": { zh: "Tab 大小", en: "Tab Size" },
  "dialog.settings.insertSpaces": { zh: "空格缩进", en: "Insert Spaces" },
  "dialog.settings.wordWrap": { zh: "自动换行", en: "Word Wrap" },
  "dialog.settings.lineNumbers": { zh: "显示行号", en: "Show Line Numbers" },
  "dialog.settings.whitespace": { zh: "显示空白字符", en: "Show Whitespace" },
  "dialog.settings.minimap": { zh: "显示小地图", en: "Show Minimap" },
  "dialog.settings.folding": { zh: "代码折叠", en: "Code Folding" },
  "dialog.settings.bracketColor": { zh: "括号配对着色", en: "Bracket Pair Colorization" },
  "dialog.settings.autoIndent": { zh: "自动缩进", en: "Auto Indent" },
  "dialog.settings.autoDetectIndent": { zh: "自动检测缩进", en: "Auto Detect Indent" },
  "dialog.settings.trimOnSave": { zh: "保存时去行尾空格", en: "Trim Trailing Whitespace on Save" },
  "dialog.settings.ensureFinalNewline": { zh: "确保文件末尾换行", en: "Ensure Final Newline" },
  "dialog.settings.themeMode": { zh: "主题模式", en: "Theme Mode" },
  "dialog.settings.followSystem": { zh: "跟随系统", en: "Follow System" },
  "dialog.settings.light": { zh: "浅色", en: "Light" },
  "dialog.settings.dark": { zh: "深色", en: "Dark" },
  "dialog.settings.reset": { zh: "恢复默认", en: "Reset to Defaults" },
  "dialog.settings.done": { zh: "完成", en: "Done" },
  "dialog.settings.language": { zh: "界面语言", en: "Interface Language" },
};

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useI18n = create<I18nStore>((set, get) => ({
  language: "zh",
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const { language } = get();
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.zh || key;
  },
}));
