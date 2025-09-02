# 监控SDK前后端联调测试启动脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "监控SDK前后端联调测试启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "正在启动后端服务器..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\server; npm start" -WindowStyle Normal

Write-Host "等待后端服务器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "正在启动前端应用..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\demo; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "启动完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "后端服务器: http://localhost:3000" -ForegroundColor White
Write-Host "前端应用: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "请按照以下步骤进行测试：" -ForegroundColor Cyan
Write-Host "1. 等待两个窗口都显示启动成功" -ForegroundColor White
Write-Host "2. 在浏览器中打开前端应用" -ForegroundColor White
Write-Host "3. 进入测试页面验证前后端连接" -ForegroundColor White
Write-Host "4. 执行各种测试操作" -ForegroundColor White
Write-Host "5. 查看统计页面验证数据同步" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Yellow
Read-Host
