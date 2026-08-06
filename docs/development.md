# 开发指南

## 开发流程

### 1. 启动开发服务器
```bash
pnpm tauri:dev
```
这将同时启动:
- Vite 前端开发服务器 (http://localhost:1420)
- Tauri 原生窗口 (热重载)

### 2. 类型检查
```bash
pnpm typecheck
```

### 3. 前端独立开发
```bash
pnpm dev
```
仅启动前端，不启动 Tauri 窗口（用于纯 UI 开发）。

## 代码规范

### Rust
- 使用 `cargo fmt` 格式化
- 使用 `cargo clippy` 检查代码质量
- 错误处理统一返回 `Result<T, String>`
- 命令函数使用 `#[tauri::command]` 宏

### TypeScript
- 严格模式 (`strict: true`)
- 使用函数式组件 + Hooks
- 状态管理使用 zustand
- 避免使用 `any`，定义清晰类型

### 样式
- 纯 CSS + CSS Variables
- macOS 原生风格变量定义在 `:root`
- 深色模式通过 `.app.dark` 类切换

## 添加新功能

### 添加 Rust 命令
1. 在 `src-tauri/src/commands/` 新建命令文件
2. 在 `commands/mod.rs` 注册模块
3. 在 `lib.rs` 的 `invoke_handler` 注册命令
4. 在 `src/services/tauri/` 创建前端调用封装

### 添加 UI 组件
1. 在 `src/components/` 对应目录新建组件
2. 如需状态，在 `src/stores/` 添加 store
3. 样式添加到 `src/styles/mac-theme.css`

### 添加 Monaco 语言支持
1. 在 `src/services/monaco/languages.ts` 的 `LANGUAGE_MAP` 添加扩展名映射
2. Monaco 内置 100+ 语言，无需额外注册

## 调试

### Rust 日志
```rust
log::info!("message");
log::error!("error");
```

### 前端调试
- 使用浏览器 DevTools (Tauri 开发模式自动启用)
- `console.log` 输出到终端

### Tauri 命令调试
```typescript
try {
  const result = await invoke("command_name", args);
} catch (err) {
  console.error("命令失败:", err);
}
```

## 常见问题

### Monaco Worker 加载失败
确保 `vite.config.ts` 中 `optimizeDeps.include` 包含 `monaco-editor`。

### 文件监听不生效
检查 `capabilities/default.json` 是否包含 `fs:allow-watch` 权限。

### 大文件打开慢
确认使用分片模式（文件 > 64MB 自动触发），检查 `chunk_reader.rs` 配置。

### 编码检测不准
GBK/GB2312 可能误判，用户可通过编码对话框手动指定。
