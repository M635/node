# MacPad - macOS 轻量化文本编辑器

对标 Notepad++ 的 macOS 轻量化文本编辑器，基于 Tauri + Rust + TypeScript + Monaco Editor 构建。

## 功能特性

### 基础编辑能力
- 多标签页打开多个文件，标签支持关闭、拖拽调换顺序
- 无限撤销重做、列块编辑、多行同时编辑、自动换行
- 显示行号、展示空格/制表符标记
- 支持 UTF-8、GBK、GB2312、UTF-16 编码识别与互相转换

### 代码编辑特性
- 上百种编程语言语法高亮（Monaco Editor 内核）
- 代码折叠、配对括号高亮
- 正则查找替换、全局目录检索
- 书签标记、行号快速跳转

### 运维场景适配
- 分片懒加载超大文件（1GB+日志/binlog）
- 监听本地文件变化，外部修改弹窗提示重载
- 支持只读模式打开日志文件

### 附加功能
- 宏录制与回放
- 简易双文件差异对比
- 自定义字体、字号、编辑器配色主题
- 支持将文本导出为 txt、html、rtf

## 技术栈

| 层 | 技术 | 用途 |
|---|---|---|
| 桌面壳 | Tauri 2.x | 跨平台打包、原生菜单、IPC |
| 后端 | Rust | 文件 IO、大文件分片、编码、监听 |
| 前端 | React 18 + TypeScript | UI 渲染 |
| 编辑器 | Monaco Editor | 语法高亮、折叠、查找 |
| 状态管理 | zustand | 轻量 store |

## 快速开始

### 环境要求
- Rust 1.75+ (stable)
- Node.js 18+
- pnpm 8+

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm tauri:dev
```

### 构建
```bash
# macOS dmg
pnpm tauri:build:mac

# Windows exe
pnpm tauri:build:win
```

## 项目结构

```
macpad/
├── src-tauri/          # Rust 后端（文件IO、编码、分片、监听）
│   └── src/
│       ├── commands/   # Tauri IPC 命令
│       ├── services/   # 业务服务层
│       └── models/     # 数据模型
├── src/                # TypeScript 前端
│   ├── components/     # UI 组件
│   ├── stores/         # zustand 状态管理
│   ├── services/       # 前端服务层 + Monaco 配置
│   ├── hooks/          # 自定义 hooks
│   └── styles/         # macOS 原生风格样式
└── docs/               # 文档
```

## 架构说明

详见 [docs/architecture.md](docs/architecture.md)

## 打包指南

详见 [docs/build.md](docs/build.md)

## License

MIT
