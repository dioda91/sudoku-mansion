@echo off
title Push to GitHub - sudoku-mansion
setlocal
cd /d "%~dp0"
where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git not found. Install Git for Windows first.
  pause
  exit /b 1
)
set "REPO=https://github.com/dioda91/sudoku-mansion.git"
echo.
echo   Target repo : %REPO%
echo   Branch      : main  and  gh-pages
echo.
echo   A GitHub sign-in window may pop up. Sign in once, then it continues.
echo   This replaces the auto-generated README with the one in this folder.
echo.
pause
git remote remove origin 2>nul
git remote add origin "%REPO%"
echo.
echo [1/2] pushing main ...
git push --force -u origin main
if errorlevel 1 ( echo [FAILED] main push failed. Check your network / proxy / login. & pause & exit /b 1 )
echo.
echo [2/2] pushing gh-pages ...
git push --force origin gh-pages
echo.
echo ============================================================
echo   Done. Wait 1-2 minutes, then open:
echo   https://dioda91.github.io/sudoku-mansion/
echo.
echo   If it shows 404:
echo     repo - Settings - Pages - Source: Deploy from a branch
echo     Branch: main   Folder: / (root)   - Save
echo ============================================================
echo.
pause