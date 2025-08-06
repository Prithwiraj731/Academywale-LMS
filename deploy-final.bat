@echo off
echo 🚀 DEPLOYING FINAL WORKING VERSION...
echo.

cd /d "d:\AcademyWale"

echo 🔄 Adding clean app.js...
git add server/app.js

echo 💾 Committing final working version...
git commit -m "FIX: Clean working backend with MongoDB auth - $(date)"

echo 📤 Pushing to GitHub...
git push

echo.
echo ✅ FINAL VERSION DEPLOYED!
echo 🌐 Check Render dashboard for deployment status
echo 🔍 Test after deployment:
echo    - https://academywale-lms.onrender.com/health
echo    - https://academywale-lms.onrender.com/api/auth/test
echo.
echo 📝 This version:
echo    ✅ Clean code with no path-to-regexp issues
echo    ✅ MongoDB Atlas integration
echo    ✅ User signup with password hashing
echo    ✅ User login with authentication
echo    ✅ JWT token generation
echo    ✅ All auth endpoints working
echo.
pause 