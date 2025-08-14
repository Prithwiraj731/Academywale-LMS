@echo off
echo ===== ACADEMYWALE ENHANCED COURSE CREATION FIX =====
echo Deploying all fixes to ensure course creation works...

echo Copying all required files...
xcopy /Y server\app.js server\app.js.backup
xcopy /Y server\src\controllers\course.controller.js server\src\controllers\course.controller.js.backup
xcopy /Y server\src\routes\course-controller.routes.js server\src\routes\course-controller.routes.js.backup
xcopy /Y server\src\routes\debug-courses.routes.js server\src\routes\debug-courses.routes.js.backup

echo Copying test page...
xcopy /Y course-creation-test.html ..\academywale-site\public\course-creation-test.html

echo Deployment documentation...
xcopy /Y COURSE-CREATION-ENHANCED.md ..\academywale-site\COURSE-CREATION-ENHANCED.md

echo Files backed up and deployed successfully!
echo.
echo === VERIFICATION STEPS ===
echo 1. Visit https://www.academywale.com/course-creation-test.html
echo 2. Use the test tool to verify if course creation works
echo 3. Try each approach in this order:
echo    - Debug endpoint (best for testing)
echo    - Controller endpoint (best for production)
echo    - Main endpoint (original implementation)
echo.
echo === DOCUMENTATION ===
echo The COURSE-CREATION-ENHANCED.md file contains details about the fix
echo.
pause
