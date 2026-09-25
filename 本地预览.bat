@echo off
title Sudoku Mansion Web - local preview
setlocal
where node >nul 2>nul
if errorlevel 1 ( echo [ERROR] Node.js not found in PATH. & pause & exit /b 1 )
echo Preview: http://127.0.0.1:8080/
echo Close this window to stop.
start "" http://127.0.0.1:8080/
node "%~dp0local-server.js" 8080
pause