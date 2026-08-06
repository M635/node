# 架构说明

## 分层架构

```
┌─────────────────────────────────────┐
│         TypeScript 视图层            │
│  (React + Monaco Editor + zustand)  │
├─────────────────────────────────────┤
│         Tauri IPC 通信层             │
├─────────────────────────────────────┤
│         Rust 底层服务层              │
│  (文件IO / 编码 / 分片 / 监听 / 搜索) │
└─────────────────────────────────────┘
```

## Rust 后端

### 命令层 (commands/)
Tauri IPC 边界，前端通过 `invoke()` 调用：
- `file_io.rs` - 打开/保存/新建文件
- `large_file.rs` - 大文件分片读取
- `encoding.rs` - 编码识别/转换
- `file_watcher.rs` - 文件变动监听
- `search.rs` - 全局目录正则检索
- `export.rs` - 导出 txt/html/rtf

### 服务层 (services/)
纯 Rust 业务逻辑，不依赖 Tauri：
- `chunk_reader.rs` - mmap + 分块读取（8MB/块）
- `encoding_detect.rs` - chardetng 编码检测
- `watcher.rs` - notify 文件监听 + 300ms debounce

### 数据模型 (models/)
- `FileMeta` - 文件元数据
- `ChunkInfo` - 分片信息
- `Encoding` - 编码枚举
- `SearchResult/Summary` - 搜索结果

## TypeScript 前端

### 状态管理 (stores/)
- `fileStore` - 标签页/打开文件列表
- `editorStore` - 编辑器配置/宏/书签
- `searchStore` - 搜索状态
- `settingStore` - 用户设置

### Monaco 配置层 (services/monaco/)
- `languages.ts` - 按需语言加载
- `themes.ts` - 深浅色主题
- `keybindings.ts` - 快捷键注册
- `folding.ts` - 代码折叠策略
- `markers.ts` - 书签装饰

### 组件层 (components/)
- `layout/` - 主布局/标题栏/状态栏
- `tabs/` - 标签栏（拖拽排序）
- `editor/` - Monaco 封装/Diff 编辑器
- `search/` - 查找替换/全局检索
- `dialog/` - 编码/设置/跳转/重载对话框
- `macro/` - 宏管理面板

## 大文件处理策略

1. 文件 > 64MB 触发分片模式
2. 使用 `memmap2` 内存映射避免一次性加载
3. 默认 8MB/块，按需读取
4. 支持读取尾部（tail）用于日志查看
5. 支持按行号跳转读取

## 编码处理流程

1. 读取前 8KB 作为采样
2. 检测 BOM (UTF-8 BOM / UTF-16 LE/BE)
3. 无 BOM 则用 `chardetng` 统计检测
4. 使用 `encoding_rs` 解码/编码
5. 支持 UTF-8/GBK/GB2312/UTF-16 互转

## 跨平台兼容

- 文件路径: `platformUtils.ts` 统一处理分隔符
- 换行符: 检测并保留 CRLF/LF
- 菜单: Tauri 原生菜单 API
- 打包: macOS dmg / Windows NSIS / Linux AppImage
