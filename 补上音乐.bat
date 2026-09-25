@echo off
title Sudoku Mansion Web - copy music
setlocal
set "GAME=E:\Sudoku.Mansion"
set "SRC=%GAME%\resources\backend\data\audio"
set "DST=%~dp0assets\audio"
if not exist "%SRC%" ( echo [ERROR] Audio folder not found: %SRC% & pause & exit /b 1 )
if not exist "%DST%" mkdir "%DST%"
echo Copying music and sound effects (about 136 MB), please wait...
copy /Y "%SRC%\*.mp3" "%DST%\" >nul
copy /Y "%SRC%\*.ogg" "%DST%\" >nul 2>nul
copy /Y "%SRC%\*.wav" "%DST%\" >nul 2>nul
echo Done. Files in assets\audio:
dir /b "%DST%" | find /c /v ""
pause