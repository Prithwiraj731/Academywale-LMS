@echo off
REM Course Management System Updates Deployment Script

echo ==============================================
echo Academywale LMS - Course Management Updates
echo ==============================================

echo.
echo 1. Building client...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Client build failed
  exit /b %ERRORLEVEL%
)

echo.
echo 2. Preparing server...
cd ..\server
call npm install

echo.
echo 3. Restarting server...
call npm run start

echo.
echo Deployment complete!
echo Course management system has been successfully updated.
echo All courses (with and without faculty) should now display properly.
echo.
