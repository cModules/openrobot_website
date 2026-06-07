# Windows PowerShell 启动脚本
# 解决终端乱码问题

# 设置代码页为 UTF-8
chcp 65001 > $null

# 禁用颜色输出
$env:FORCE_COLOR = '0'
$env:NO_COLOR = '1'

Write-Host "Starting OpenRobotVision development server..." -ForegroundColor Green

# 启动 Vite 开发服务器
npm run dev
