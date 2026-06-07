@echo off
REM Windows 启动脚本 - 禁用颜色输出以解决终端乱码问题
set FORCE_COLOR=0
echo Starting OpenRobotVision development server...
npm run dev
