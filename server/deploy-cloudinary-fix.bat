@echo off
echo =======================================
echo CLOUDINARY API KEY FIX DEPLOYMENT
echo =======================================
echo.
echo This script will commit and push the Cloudinary API key fix to GitHub
echo and trigger a redeployment on Render.com
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

git add app.js
git commit -m "Fix: Cloudinary API key configuration conflicts in app.js"
git push origin main

echo.
echo =======================================
echo Changes pushed successfully!
echo.
echo IMPORTANT: Go to your Render.com dashboard and
echo manually trigger a redeploy of your service.
echo =======================================
echo.
pause
