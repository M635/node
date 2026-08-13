#!/bin/bash
# MarkPT 自动推送脚本
# 用法: GH_TOKEN=ghp_xxx bash push.sh

if [ -z "$GH_TOKEN" ]; then
    echo "请设置环境变量 GH_TOKEN"
    echo "用法: GH_TOKEN=ghp_xxx bash push.sh"
    exit 1
fi

REPO_URL="https://${GH_TOKEN}@github.com/M635/node.git"
MAX_MINUTES=10
START_TIME=$(date +%s)
MAX_SECONDS=$((MAX_MINUTES * 60))
ATTEMPT=0

echo "=========================================="
echo "  MarkPT 自动推送脚本"
echo "  最大重试时间: ${MAX_MINUTES} 分钟"
echo "=========================================="

while true; do
    ATTEMPT=$((ATTEMPT + 1))
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))

    if [ $ELAPSED -ge $MAX_SECONDS ]; then
        echo "[失败] 超过最大重试时间 ${MAX_MINUTES} 分钟，共尝试 ${ATTEMPT} 次"
        exit 1
    fi

    REMAINING=$((MAX_SECONDS - ELAPSED))
    echo "[第 ${ATTEMPT} 次尝试] 剩余 ${REMAINING} 秒"

    if git push "$REPO_URL" main 2>&1; then
        echo "main 推送成功!"
        if git push "$REPO_URL" v2.0.0 --force 2>&1; then
            echo "v2.0.0 标签推送成功! 共 ${ATTEMPT} 次, 耗时 ${ELAPSED}s"
            exit 0
        else
            echo "标签失败，5秒后重试..."; sleep 5; continue
        fi
    else
        echo "main 失败，5秒后重试..."; sleep 5
    fi
done
