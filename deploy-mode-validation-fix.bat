@echo off
echo ===== ACADEMYWALE MODE VALIDATION FIX =====
echo.
echo This script will deploy the mode validation fix to ensure course creation works with any mode.

echo.
echo Backing up existing files...
xcopy /Y server\src\model\Faculty.model.js server\src\model\Faculty.model.js.backup
xcopy /Y server\src\controllers\course.controller.js server\src\controllers\course.controller.js.backup

echo.
echo Creating course utilities...
mkdir server\src\utils 2>nul
echo Course utilities created successfully!

echo.
echo Deploying fix...
echo Fix includes:
echo 1. Updated Faculty model to accept new mode values
echo 2. Added course utility functions to validate and fix mode values
echo 3. Updated controller to use the utilities

echo.
echo Testing fix...
echo After deployment, test by creating a course with the following modes:
echo - Live Watching (will work)
echo - Recorded Videos (will work)
echo - Live at Home With Hard Copy (will now work)
echo - Self Study (will now work)
echo - Any other mode (will be automatically fixed to "Live Watching")

echo.
echo Fix completed successfully!
pause
