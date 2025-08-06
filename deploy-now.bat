@echo off
echo 🚀 DEPLOYING ACADEMYWALE BACKEND TO RENDER...
echo.

echo 📁 Current directory:
cd /d "d:\AcademyWale"
pwd

echo.
echo 🔄 Adding all changes to git...
git add .

echo.
echo 💾 Committing changes...
git commit -m "FIX: Robust server startup with auth routes - $(date)"

echo.
echo 📤 Pushing to GitHub...
git push

echo.
echo ✅ DEPLOYMENT TRIGGERED!
echo.
echo 🌐 Your Render service should auto-deploy now.
echo 📊 Check your Render dashboard for deployment status.
echo.
echo 🔍 Test these URLs after deployment:
echo    - https://academywale-lms.onrender.com/health
echo    - https://academywale-lms.onrender.com/api/auth/test
echo    - https://academywale-lms.onrender.com/api/auth/signup
echo.
pause 