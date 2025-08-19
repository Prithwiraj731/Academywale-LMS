@echo off
echo =============================================
echo EMERGENCY: PURGE ALL COURSES FROM THE SYSTEM
echo =============================================
echo.
echo WARNING: This will delete ALL courses from ALL faculties!
echo There is NO WAY to recover this data once deleted!
echo.
set /p confirm=Are you absolutely sure you want to continue? (yes/no): 

if /i "%confirm%" NEQ "yes" (
  echo Operation cancelled.
  exit /b
)

echo.
echo Installing required dependencies...
cd /d "%~dp0\server"
call npm install --no-save dotenv node-fetch@2

echo.
echo Executing course purge script...
echo.
node purge-all-courses.js

echo.
echo Operation complete.
pause
