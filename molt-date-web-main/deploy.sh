#!/bin/bash

# 一键部署脚本
echo "=== Molt Date Web 一键部署脚本 ==="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装，请先安装Docker"
    exit 1
fi

# 检查docker-compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "错误: docker-compose 未安装，请先安装docker-compose"
    exit 1
fi

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
    echo "警告: .env文件不存在，将使用默认配置"
    echo "请参考.env.example创建.env文件并配置相应的环境变量"
    cp .env.example .env
    echo "已创建默认.env文件，请根据实际情况修改"
fi

# 构建并启动服务
echo "正在构建并启动服务..."
# 设置超时时间为60秒
export COMPOSE_HTTP_TIMEOUT=60
docker-compose up -d --build || {
    echo "错误: 服务构建或启动失败，请检查网络连接和Docker配置"
    echo "尝试重新拉取镜像..."
    docker-compose pull
    echo "再次尝试构建并启动服务..."
    docker-compose up -d --build
}

# 检查服务状态
echo "正在检查服务状态..."
sleep 10

# 检查服务是否正常运行
APP_STATUS=$(docker-compose ps -q app | wc -l)
DB_STATUS=$(docker-compose ps -q db | wc -l)

if [ $APP_STATUS -eq 1 ] && [ $DB_STATUS -eq 1 ]; then
    echo "服务启动成功！"
    echo "=== 部署完成 ==="
    echo "应用已部署到 http://localhost:3000"
    echo "数据库已部署到 localhost:5432"
    echo ""
    echo "注意事项:"
    echo "1. 首次部署时，数据库会自动初始化表结构"
    echo "2. 请确保.env文件中的环境变量配置正确"
    echo "3. 如需停止服务，请运行: docker-compose down"
    echo "4. 如需查看日志，请运行: docker-compose logs"
else
    echo "错误: 服务启动失败，请查看日志以获取详细信息"
    echo "运行以下命令查看日志:"
    echo "  docker-compose logs app"
    echo "  docker-compose logs db"
fi
