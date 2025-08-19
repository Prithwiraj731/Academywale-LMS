@echo off
echo ==================================================
echo DEPLOYING EMERGENCY COURSE HARDCODED REMOVAL FIX
echo ==================================================
echo.

cd /d "%~dp0"

echo Copying CAInterPaperDetailPage.jsx to production...
xcopy /y "client\src\pages\CAInterPaperDetailPage.jsx" "build\client\src\pages\" 

echo Building client...
cd client
call npm run build

echo.
echo Build complete. Please deploy the updated build to your hosting provider.
echo.

pause
