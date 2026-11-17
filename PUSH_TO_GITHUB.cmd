@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "REPO=https://github.com/ricotacheesesandwich/NUO.git"

echo ================================================
echo NUO Website - Push to GitHub main

echo Repository: %REPO%
echo ================================================

where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or is not in PATH.
    echo Install Git for Windows: https://git-scm.com/downloads/win
    pause
    exit /b 1
)
if not exist "index.html" (
    echo ERROR: index.html not found. Run this file inside the project folder.
    pause
    exit /b 1
)

if not exist ".git" (
    git init -b main
    if errorlevel 1 goto :error
) else (
    echo Existing Git folder detected.
)

rem Check whether origin already points to another project.
for /f "usebackq delims=" %%U in (`git remote get-url origin 2^>nul`) do set "OLD_REMOTE=%%U"
if defined OLD_REMOTE (
    if /i not "%OLD_REMOTE%"=="%REPO%" (
        echo ERROR: origin already points to another repository:
        echo %OLD_REMOTE%
        echo Not changing it automatically. Please check before pushing.
        pause
        exit /b 1
    )
) else (
    git remote add origin "%REPO%"
    if errorlevel 1 goto :error
)

git branch -M main
if errorlevel 1 goto :error

echo.
echo Pushing requires authentication with your GitHub account.
echo Proceed to commit and push this project to main? [Y/N]
choice /C YN /N
if errorlevel 2 exit /b 0

git add .
if errorlevel 1 goto :error

git diff --cached --quiet
if errorlevel 1 (
    git commit -m "feat: publish optimized NUO website"
    if errorlevel 1 goto :error
) else (
    echo No new changes to commit.
)

git push -u origin main
if errorlevel 1 goto :error

echo.
echo SUCCESS: Pushed to https://github.com/ricotacheesesandwich/NUO

echo Next: Settings ^> Pages ^> Deploy from a branch ^> main ^> /(root)
echo Expected site: https://ricotacheesesandwich.github.io/NUO/
pause
exit /b 0

:error
echo.
echo ERROR: Git command failed. Please read the message above.
pause
exit /b 1
