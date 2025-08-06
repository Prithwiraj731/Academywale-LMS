@echo off
echo 🚀 DEPLOYING WORKING BACKEND WITH MONGODB...
echo.

cd /d "d:\AcademyWale"

echo 🔄 Adding working app.js...
git add server/app.js

echo 💾 Committing complete working version...
git commit -m "FIX: Complete working backend with MongoDB auth - $(date)"

echo 📤 Pushing to GitHub...
git push

echo.
echo ✅ WORKING BACKEND DEPLOYED!
echo 🌐 Check Render dashboard for deployment status
echo 🔍 Test endpoints after deployment:
echo    - https://academywale-lms.onrender.com/health
echo    - https://academywale-lms.onrender.com/api/auth/test
echo    - https://academywale-lms.onrender.com/api/auth/signup
echo.
echo 📝 Features added:
echo    ✅ MongoDB Atlas integration
echo    ✅ User signup with password hashing
echo    ✅ User login with authentication
echo    ✅ JWT token generation
echo    ✅ User data saved to database
echo.
pause 