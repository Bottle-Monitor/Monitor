@echo off
echo 🚀 启动 Bottle Monitor 开发环境...
echo.

echo 📡 启动后端服务器...
cd apps\server
start "Backend Server" cmd /k "npm install && npm start"

echo ⏳ 等待后端启动...
timeout /t 3 /nobreak > nul

echo 🌐 启动前端应用...
cd ..\demo
start "Frontend App" cmd /k "npm install && npm run dev"

echo.
echo ✅ 开发环境启动完成！
echo 📱 前端地址: http://localhost:5173
echo 🔧 后端地址: http://localhost:3000
echo.
echo 💡 提示: 请确保两个终端都正常运行
pause
