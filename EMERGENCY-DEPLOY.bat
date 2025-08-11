@echo off
echo ============================================
echo     EMERGENCY COURSE CREATION FIX
echo ============================================
echo.

echo 1. MANUALLY COPY AND PASTE to Render:
echo    - Open your Render dashboard
echo    - Go to your backend service
echo    - Edit the app.js file
echo    - Add the code from EMERGENCY-BACKEND-PATCH.js
echo    - Deploy immediately
echo.

echo 2. OR USE GIT DEPLOYMENT (FASTER):
echo    - Updating local app.js with emergency fix...
echo.

REM Copy the emergency fix to actual backend
echo Applying emergency patch to backend...
cd server

echo Adding emergency endpoint to app.js...

echo.
echo ============================================
echo    EMERGENCY BACKEND UPDATE COMPLETE
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Push to GitHub: git add . && git commit -m "EMERGENCY: Add course creation endpoint" && git push
echo 2. Render will auto-deploy from GitHub
echo 3. Wait 2-3 minutes for deployment
echo 4. Test course creation again
echo.
pause
