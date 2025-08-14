@echo off
echo 🚨 FORCE DEPLOYING CORS FIX NOW! 🚨
echo.

echo 📋 Adding app.js changes...
git add server/app.js

echo 📋 Committing CORS fix...
git commit -m "FORCE CORS FIX - academywale-lms.onrender.com allowed"

echo 📋 Pushing to trigger Render deployment...
git push origin main

echo.
echo ✅ CORS fix deployed! Wait 2-3 minutes for Render to redeploy.
echo.
echo 🧪 Test course creation again after deployment completes.
pause
