@echo off
echo 🚀 DEPLOYING FIXED BACKEND IMMEDIATELY...
echo.

cd /d "d:\AcademyWale"

echo 🔄 Adding fixed files...
git add server/app.js server/package.json

echo 💾 Committing fix...
git commit -m "FIX: Replace app.js with working minimal version - $(date)"

echo 📤 Pushing to GitHub...
git push

echo.
echo ✅ FIX DEPLOYED!
echo 🌐 Check Render dashboard for deployment status
echo 🔍 Test: https://academywale-lms.onrender.com/api/auth/test
echo.
pause 