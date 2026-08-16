# MarkPT 构建、打包与版本发布指南

本文档说明如何完成 MarkPT 的本地验证、代码提交、构建打包、版本 tag 与 GitHub Release 发布。

## 一、环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 18（CI 使用 20） | 前端构建 |
| pnpm | >= 8 | 包管理（`tauri.conf.json` 的 beforeBuildCommand 使用 pnpm） |
| Rust | >= 1.75 | `rustup` 安装 stable 工具链 |
| Tauri CLI | 2.x | 通过 `pnpm tauri` 调用，无需全局安装 |
| macOS | Xcode Command Line Tools | 打包 dmg 需要 |
| Windows | MSVC 构建工具 + WebView2 | 打包 NSIS 需要；`rustup target add x86_64-pc-windows-msvc` |
| Linux | webkit2gtk-4.1 等 | `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev` |

## 二、本地验证测试步骤

### 1. 前端类型检查与构建
```bash
pnpm install
pnpm typecheck        # tsc --noEmit，无报错即通过
pnpm build            # tsc && vite build，产物在 dist/
```

### 2. 后端编译检查（Rust）
```bash
cd src-tauri
cargo fmt --check     # 代码格式
cargo clippy          # 静态检查
cargo check           # 编译检查（不产出二进制）
```

### 3. 启动验证（开发模式）
```bash
pnpm tauri:dev
```
- **正常启动**：窗口出现，菜单栏/工具栏/状态栏正常渲染。

### 4. 退出验证（无残留进程）
- 点击窗口红色关闭按钮 → 应用应完整退出（macOS 上不再“只关窗口、进程残留”）。
- 菜单「文件 → 退出 MarkPT」→ 立即退出。
- 终端 `Ctrl+C`（SIGINT）或 `kill -TERM <pid>`（SIGTERM）→ 优雅退出。
- 退出后验证：
  ```bash
  ps aux | grep -i markpt   # 无残留进程
  ```
  - 若退出前使用过「运行命令」启动长时间子进程（如 `sleep 300`），退出后 `pgrep -f sleep` 应无残留（子进程组被统一终止）。

### 5. 中文模式无混杂英文验证
- 设置 → 界面语言 → 简体中文。
- 依次打开：所有对话框（跳转行/编码/设置/字符统计/文件属性/切换文档/快捷键/特殊字符/颜色/日期时间/文本转换/批量替换/正则/CSV/函数列表/剪贴板历史/代码片段/插件管理/宏/十六进制/运行命令）、右键菜单、状态栏、toast/错误弹窗。
- 预期：全部为简体中文，无 bug/issue/error 等英文词汇混入；技术名词（MarkPT、UTF-8、JSON、Cmd 键名等）除外。
- 重启应用 → 界面语言与原生菜单语言保持一致（语言偏好已持久化）。

## 三、提交代码到 GitHub

```bash
git checkout -b fix/graceful-exit-and-i18n   # 或直接在 main 上提交
git add -A
git commit -m "fix: 优雅退出与资源清理 + 中文界面文案统一"
git push origin main
# 或使用仓库自带的重试脚本（弱网环境）:
GH_TOKEN=ghp_xxx bash push.sh
```

## 四、MarkPT 构建与打包

### 本地打包
```bash
pnpm tauri:build:mac     # macOS Universal（dmg）
pnpm tauri:build:win     # Windows（NSIS setup.exe）
pnpm tauri build         # 当前平台（Linux 产出 AppImage + deb）
```
产物位置：`src-tauri/target/<target>/release/bundle/` 下对应的 `dmg/nsis/appimage/deb` 目录。

### 使用 GitHub Actions（推荐，仓库已内置）
仓库内置 `.github/workflows/release.yml` 与 `build-macos.yml`、`build-windows.yml`、`build-linux.yml`：
- 推 tag 即自动触发三平台构建并生成 Release；
- 也可在 Actions 页面手动触发（workflow_dispatch，输入版本号）。

## 五、版本 tag 发布与生成 Release

### 方式 A：GitHub Actions 自动发布（推荐）
```bash
# 1. 确认三处版本号一致后提交（见下方“版本号修改要点”）
# 2. 打 tag 并推送
git tag -a v2.8.1 -m "MarkPT v2.8.1: 修复退出与中文界面问题"
git push origin v2.8.1
# 3. 推送后 Actions 自动运行：三平台构建 → 创建 GitHub Release → 上传安装包
```
查看进度：GitHub 仓库 → Actions 标签页。

### 方式 B：本地构建 + gh CLI 发布
```bash
# 1. 本地构建（见第四节）
# 2. 创建 Release 并上传产物
gh release create v2.8.1 \
  --title "MarkPT v2.8.1" \
  --notes "修复优雅退出、资源清理与中文界面文案问题，详见 RELEASING.md" \
  src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg \
  src-tauri/target/release/bundle/nsis/*.exe \
  src-tauri/target/release/bundle/appimage/*.AppImage
```

### 方式 C：GitHub 网页手动发布
1. 推送 tag（`git push origin v2.8.1`）；
2. 打开仓库 Releases 页面 → Draft a new release → 选择 tag；
3. 填写标题/说明，上传本地打包产物 → Publish release。

## 六、注意事项

### 版本号修改要点（发布前必须同步三处）
| 文件 | 字段 |
|------|------|
| `package.json` | `"version": "x.y.z"` |
| `src-tauri/Cargo.toml` | `version = "x.y.z"` |
| `src-tauri/tauri.conf.json` | `"version": "x.y.z"` |

- 前端界面展示的版本号统一取自 `tauri.conf.json`（vite 注入 `__APP_VERSION__`），改这一处即可全界面同步。
- tag 命名规则：`v` + 版本号（如 `v2.8.1`），与 Release 工作流的 `v*` 触发器匹配。
- 三处版本不一致会导致：安装包版本、状态栏版本、Release 名称互相矛盾。

### 构建依赖注意
- CI 使用 pnpm 9；本地请保持 `pnpm install` 后 lockfile 一致，避免 CI 构建失败。
- macOS Universal 打包需要 `rustup target add aarch64-apple-darwin x86_64-apple-darwin`。
- Windows 打包需要 NSIS（tauri-action 自动处理）；本地需安装 WebView2 运行时。
- Linux 打包需先安装 webkit2gtk-4.1 等系统依赖（见第一节）。

### 密钥与安全
- 不要把 GitHub Token 明文写入任何提交的文件或脚本；本地推送时优先使用 `gh auth login` 或 git credential manager。
- 若 Token 已泄露，立即在 GitHub → Settings → Developer settings → Tokens 中吊销并重新生成。

### 提交规范建议
- 缺陷修复用 `fix:` 前缀，功能新增用 `feat:`，文档用 `docs:`，版本号变更用 `chore:`。
- 每次发布前运行 `pnpm typecheck` 与 `cargo clippy`，确保 CI 一次通过。
