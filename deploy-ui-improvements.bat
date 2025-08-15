@echo off
echo ===== DEPLOYING UI IMPROVEMENTS FOR COURSE CARDS =====
echo.
echo Pushing changes to GitHub...
git add .
git commit -m "Improve course card UI across all pages with responsive design"
git push origin main
echo.
echo ===== DEPLOYMENT COMPLETE =====
echo.
echo Your UI improvements have been pushed to GitHub.
echo Render should automatically deploy the changes.
echo.
echo Verify your application at: https://academywale-lms.onrender.com
pause
