@echo off
echo 🚨 IMMEDIATE CORS FIX DEPLOYMENT 🚨
echo.
echo 🔍 Problem: Frontend calling deployed backend with CORS errors
echo 🌐 Deployed URL: https://academywale-lms.onrender.com
echo ❌ Error: CORS header 'Access-Control-Allow-Origin' missing
echo.
echo 🛠️  Solution: Deploy CORS fixes to Render backend
echo.

echo 📋 Step 1: Check current git status...
git status

echo.
echo 📋 Step 2: Add all CORS fixes...
git add .

echo.
echo 📋 Step 3: Commit CORS fixes...
git commit -m "🚨 IMMEDIATE CORS FIX: Add academywale-lms.onrender.com to allowed origins"

echo.
echo 📋 Step 4: Push to trigger Render deployment...
git push origin main

echo.
echo ✅ CORS fixes deployed! Render will automatically redeploy.
echo.
echo ⏳ Wait 2-3 minutes for deployment to complete...
echo.
echo 🧪 Test the course creation again after deployment completes.
echo.
pause
