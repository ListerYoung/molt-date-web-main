#!/bin/bash

# Node.js 部署脚本
echo "=== Molt Date Web Node.js 部署脚本 ==="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装Node.js 18或更高版本"
    exit 1
fi

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
    echo "正在安装pnpm..."
    npm install -g pnpm
fi

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
    echo "警告: .env文件不存在，将使用默认配置"
    echo "请参考.env.example创建.env文件并配置相应的环境变量"
    cp .env.example .env
    echo "已创建默认.env文件，请根据实际情况修改"
fi

# 安装依赖
echo "正在安装依赖..."
pnpm install

# 构建应用
echo "正在构建应用..."
pnpm run build

# 启动应用
echo "正在启动应用..."
pnpm run start