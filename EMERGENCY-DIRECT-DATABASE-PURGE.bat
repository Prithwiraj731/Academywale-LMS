@echo off
echo =============================================
echo EMERGENCY: DIRECT DATABASE COURSE PURGE
echo =============================================
echo.
echo WARNING: This will DIRECTLY delete ALL courses from ALL faculties in the database!
echo There is NO WAY to recover this data once deleted!
echo This will connect directly to MongoDB - no need to start the server.
echo.
set /p confirm=Are you absolutely sure you want to continue? (yes/no): 

if /i "%confirm%" NEQ "yes" (
  echo Operation cancelled.
  exit /b
)

echo.
echo Installing required dependencies...
cd /d "%~dp0\server"
call npm install --no-save dotenv mongoose

echo.
echo Executing direct database purge script...
echo.
node direct-purge-all-courses.js

echo.
echo Operation complete.
pause
