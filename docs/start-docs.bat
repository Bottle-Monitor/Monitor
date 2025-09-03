@echo off
echo Starting Bottle Monitor Documentation Site...
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting development server...
echo.
echo Documentation will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

REM 使用 npx 来确保使用正确的 VitePress 版本
npx vitepress dev

pause
