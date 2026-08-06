#!/bin/bash
# MacPad GitHub 推送脚本
# 在有网络的环境下执行: bash push-to-github.sh

set -e

cd "$(dirname "$0")"

echo "=== 推送 MacPad 到 GitHub ==="
echo "仓库: https://github.com/M635/node.git"
echo "分支: main"
echo ""

# 检查 git 仓库
if [ ! -d .git ]; then
    echo "❌ 未找到 Git 仓库"
    exit 1
fi

# 推送
echo "正在推送..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo "仓库地址: https://github.com/M635/node"
else
    echo ""
    echo "❌ 推送失败，请检查网络和认证"
    exit 1
fi
