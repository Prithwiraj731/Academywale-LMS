@echo off
echo ===== DEPLOYING MIDDLEWARE REFERENCE FIX =====
echo.
echo Pushing changes to GitHub...
git add .
git commit -m "Fix middleware reference error in app.js"
git push origin main
echo.
echo ===== DEPLOYMENT COMPLETE =====
echo.
echo Your fixes have been pushed to GitHub.
echo Render should automatically deploy the changes.
echo.
echo Verify your application at: https://academywale-lms.onrender.com
pause
