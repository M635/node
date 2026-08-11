import { create } from "zustand";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
}

export interface PluginCommand {
  id: string;
  title: string;
  handler: () => void;
}

interface PluginStore {
  plugins: PluginManifest[];
  commands: PluginCommand[];
  registerPlugin: (manifest: PluginManifest) => void;
  unregisterPlugin: (id: string) => void;
  togglePlugin: (id: string) => void;
  registerCommand: (command: PluginCommand) => void;
  executeCommand: (id: string) => void;
  getCommands: () => PluginCommand[];
}

const builtinPlugins: PluginManifest[] = [
  {
    id: "code-formatter",
    name: "代码格式化",
    version: "1.0.0",
    description: "JSON/XML/HTML/CSS/SQL 代码格式化",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "text-transform",
    name: "文本转换",
    version: "1.0.0",
    description: "Base64/URL/ROT13/哈希等文本转换",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "char-convert",
    name: "字符转换",
    version: "1.0.0",
    description: "全角/半角/Unicode归一化/命名风格转换",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "snippets",
    name: "代码片段",
    version: "1.0.0",
    description: "代码片段管理和 Tab 展开",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "clipboard-history",
    name: "剪贴板历史",
    version: "1.0.0",
    description: "记录最近复制的多段内容",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "markdown-preview",
    name: "Markdown 预览",
    version: "1.0.0",
    description: "Markdown 实时预览",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "csv-viewer",
    name: "CSV 查看器",
    version: "1.0.0",
    description: "CSV/TSV 表格查看",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "regex-tester",
    name: "正则测试器",
    version: "1.0.0",
    description: "正则表达式测试工具",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "hex-viewer",
    name: "十六进制查看器",
    version: "1.0.0",
    description: "文件十六进制查看",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "diff-viewer",
    name: "文件对比",
    version: "1.0.0",
    description: "双文件 Diff 对比",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "function-list",
    name: "函数列表",
    version: "1.0.0",
    description: "代码函数/方法列表导航",
    author: "MarkPT",
    enabled: true,
  },
  {
    id: "session-manager",
    name: "会话管理",
    version: "1.0.0",
    description: "自动保存和恢复编辑会话",
    author: "MarkPT",
    enabled: true,
  },
];

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: builtinPlugins,
  commands: [],
  registerPlugin: (manifest) =>
    set((state) => ({
      plugins: [...state.plugins.filter((p) => p.id !== manifest.id), manifest],
    })),
  unregisterPlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.filter((p) => p.id !== id),
      commands: state.commands.filter((c) => !c.id.startsWith(id)),
    })),
  togglePlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      ),
    })),
  registerCommand: (command) =>
    set((state) => ({
      commands: [...state.commands.filter((c) => c.id !== command.id), command],
    })),
  executeCommand: (id) => {
    const cmd = get().commands.find((c) => c.id === id);
    if (cmd) cmd.handler();
  },
  getCommands: () => get().commands,
}));
