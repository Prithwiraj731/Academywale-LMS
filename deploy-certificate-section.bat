@echo off
echo ===== DEPLOYING CERTIFICATE SECTION TO HOMEPAGE =====
echo.
echo Pushing changes to GitHub...
git add .
git commit -m "Add SJC certificate section to homepage"
git push origin main
echo.
echo ===== DEPLOYMENT COMPLETE =====
echo.
echo Your changes have been pushed to GitHub.
echo Render should automatically deploy the changes.
echo.
echo Verify your application at: https://academywale-lms.onrender.com
pause
