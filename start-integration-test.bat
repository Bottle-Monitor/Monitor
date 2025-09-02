@echo off
echo ========================================
echo 监控SDK前后端联调测试启动脚本
echo ========================================
echo.

echo 正在启动后端服务器...
start "后端服务器" cmd /k "cd apps\server && npm start"

echo 等待后端服务器启动...
timeout /t 5 /nobreak >nul

echo 正在启动前端应用...
start "前端应用" cmd /k "cd apps\demo && npm run dev"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo.
echo 后端服务器: http://localhost:3000
echo 前端应用: http://localhost:5173
echo.
echo 请按照以下步骤进行测试：
echo 1. 等待两个窗口都显示启动成功
echo 2. 在浏览器中打开前端应用
echo 3. 进入测试页面验证前后端连接
echo 4. 执行各种测试操作
echo 5. 查看统计页面验证数据同步
echo.
echo 按任意键退出...
pause >nul
