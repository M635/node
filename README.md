# MarkPT - 跨平台轻量化文本编辑器

对标 Notepad++ 的跨平台轻量化文本编辑器，基于 Tauri + Rust + TypeScript + Monaco Editor 构建。

## v2.8.3 更新内容

### 编辑器稳定性修复
- 修复右键菜单接近窗口边缘时位置闪烁：改用 useLayoutEffect 在绘制前同步调整位置
- 修复 MonacoEditor resize 事件监听器未清理导致内存泄漏：组件卸载后不再调用已销毁的 editor.layout()
- 修复 SplitEditor 同步滚动开关不生效：闭包捕获初始值问题，改用 ref 实时读取 syncScroll 状态

## v2.8.2 更新内容

### 编辑器右键菜单与命令面板（缺陷修复）
- 修复 Monaco 编辑器右键菜单中英文混杂：禁用内置菜单，改用自定义 React 右键菜单，全部走 i18n，语言切换即时刷新
- 修复命令面板（CommandPalette）窗口无法自适应编辑区：去掉固定高度，改用 max-height + flex 自适应，小窗口下不再被截断
- 命令面板快捷键平台适配（macOS 显示 Cmd，Windows/Linux 显示 Ctrl）
- 语言切换时重新注册编辑器 Action，刷新所有命令标签语言

## v2.8.1 更新内容

### 进程与退出（缺陷修复）
- 修复关闭窗口后进程残留/无法优雅退出的问题：统一「前端保存会话 → 后端清理资源 → 退出」流程
- 后端拦截窗口关闭请求，10 秒兜底看门狗防止进程卡死
- 新增 SIGINT/SIGTERM 信号监听，收到信号优雅清理并退出
- 退出前统一终止「运行命令」启动的子进程（含进程组），释放文件监听句柄，无僵尸进程残留
- 「运行命令」对话框真正执行命令并显示输出，超时自动终止
- 修复「在默认程序打开」菜单点击无反应

### 中文界面（缺陷修复）
- 所有弹窗、按钮、状态标签、提示文本统一简体中文，杜绝中英混杂
- 错误提示改为友好中文，原始错误只写入调试日志
- 界面语言选择持久化，重启后界面与原生菜单语言一致
- 修复原生菜单重建时的内存泄漏

### 其它修复与优化
- 关闭窗口时会话保存不再被中断；恢复会话保留未保存的修改，避免工作内容丢失
- 修复菜单「开始/停止录制宏、播放宏、保存宏、多次运行宏」点击无反应
- 修复剪贴板历史面板始终为空（监听器未初始化）
- 修复文件属性对话框创建/访问时间显示为空
- 修复复制标签页副本后未激活新标签
- 修复状态栏与欢迎页版本号停留在 v2.0.0（统一取自 tauri.conf.json）
- 设置项与语言偏好持久化，重启后生效
- 后端错误统一映射为中文提示

## 功能特性

### 基础编辑能力
- 多标签页打开多个文件，标签支持关闭、拖拽调换顺序、着色、排序
- 无限撤销重做、列块编辑、多行同时编辑、自动换行
- 显示行号、展示空格/制表符标记
- 支持 UTF-8、UTF-8-BOM、GBK、GB2312、UTF-16 编码识别与互相转换
- BOM 操作、按编码打开

### 代码编辑特性
- 上百种编程语言语法高亮（Monaco Editor 内核）
- 代码折叠、配对括号高亮
- 正则查找替换、选区内查找替换、全局目录检索
- 书签标记、行号快速跳转
- 代码格式化（JSON/XML/HTML/CSS/SQL）

### 运维场景适配
- 分片懒加载超大文件（1GB+日志/binlog）
- 监听本地文件变化，外部修改弹窗提示重载
- 支持只读模式打开日志文件
- 保存时去空格、确保末尾换行

### 附加功能
- 宏录制与回放
- 简易双文件差异对比
- 自定义字体、字号、编辑器配色主题
- 支持将文本导出为 txt、html、rtf
- Markdown 实时预览、CSV/TSV 查看器
- 正则表达式测试器
- 文本转换（Base64/URL/ROT13/哈希等）
- 字符转换（全角/半角/Unicode归一化/命名风格）
- i18n 中英文界面

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
markpt/
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

## 构建、打包与版本发布

完整流程（本地验证、提交、构建打包、tag 发布、生成 Release 及注意事项）详见 [RELEASING.md](RELEASING.md)。仓库内置 GitHub Actions 发布工作流：推送 `v*` 标签自动完成三平台构建并生成 Release。

## License

MIT
