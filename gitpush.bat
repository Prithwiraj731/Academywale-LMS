@echo off
:: Check if a commit message was provided
IF "%~1"=="" (
    echo Please provide a commit message.
    echo Usage: gitpush.bat "Your commit message here"
    exit /b
)

git add .
git commit -m "%~1"
git push origin main
pause
