@echo off
title 数独庄园 - 手机访问（局域网）
setlocal
where node >nul 2>nul
if errorlevel 1 ( echo [ERROR] 没有找到 Node.js，请先安装 Node.js。 & pause & exit /b 1 )
echo.
echo   手机和电脑连同一个 Wi-Fi，然后在手机浏览器里打开下面 Phone 那一行网址。
echo   关掉这个窗口就停止。
echo.
start "" http://127.0.0.1:8080/
node "%~dp0local-server.js" 8080
pause