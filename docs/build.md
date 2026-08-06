# 打包指南

## 环境准备

### macOS
```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
```

### Windows
```powershell
# 安装 Rust (MSVC 工具链)
winget install Rustlang.Rustup
rustup target add x86_64-pc-windows-msvc

# 安装依赖
pnpm install
```

### Linux
```bash
# 安装系统依赖
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装依赖
pnpm install
```

## 开发模式

```bash
pnpm tauri:dev
```

## 打包命令

### macOS (dmg)
```bash
# Intel + Apple Silicon 通用二进制
pnpm tauri:build:mac
# 或
pnpm tauri build --target universal-apple-darwin

# 仅 Intel
pnpm tauri build --target x86_64-apple-darwin

# 仅 Apple Silicon
pnpm tauri build --target aarch64-apple-darwin
```

产物路径: `src-tauri/target/release/bundle/dmg/MacPad_*.dmg`

### Windows (exe)
```bash
# NSIS 安装包
pnpm tauri:build:win
# 或
pnpm tauri build --target x86_64-pc-windows-msvc
```

产物路径: `src-tauri/target/release/bundle/nsis/MacPad_*-setup.exe`

### Linux (AppImage/deb)
```bash
pnpm tauri build
```

产物路径:
- `src-tauri/target/release/bundle/appimage/MacPad_*.AppImage`
- `src-tauri/target/release/bundle/deb/MacPad_*.deb`

## 体积优化

目标: macOS dmg < 25MB

已采用的优化措施:
1. Rust release profile: `lto=true`, `opt-level="s"`, `strip=true`
2. Monaco Editor 按需加载语言包
3. Vite manualChunks 分包 (monaco/react 独立 chunk)
4. 禁用不必要的 Tauri features
5. CSS 纯手写，无 Tailwind 运行时

验证体积:
```bash
ls -lh src-tauri/target/release/bundle/dmg/
```

## 代码签名 (可选)

### macOS
```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name"
pnpm tauri build --target universal-apple-darwin
```

### Windows
```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = "path/to/key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = "password"
pnpm tauri build
```
