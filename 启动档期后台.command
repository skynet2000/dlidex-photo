#!/bin/bash
# 冻梨摄影 · 档期管理后台 一键启动
# 双击本文件即可启动后台，并自动打开浏览器到 /admin
cd "$(dirname "$0")" || exit 1

# 确保使用本机已安装的 node/npm
export PATH="~/.workbuddy/binaries/node/versions/22.22.2/bin:$PATH"

if lsof -ti :5173 >/dev/null 2>&1; then
  echo "后台已在运行，直接打开浏览器"
  open "http://localhost:5173/admin"
else
  echo "正在启动档期后台（约 1~3 秒后自动打开浏览器）…"
  (sleep 2 && open "http://localhost:5173/admin") &
  npm run dev
fi
