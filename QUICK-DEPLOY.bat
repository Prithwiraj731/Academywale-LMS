@echo off
echo 🚨 QUICK DEPLOY - BYPASSING GIT PAGER 🚨
echo.

set GIT_PAGER=
set GIT_TERMINAL_PROGRESS=0

echo 📋 Force adding app.js...
git add -f server/app.js

echo 📋 Force committing...
git commit -m "EMERGENCY CORS FIX"

echo 📋 Force pushing...
git push -f origin main

echo.
echo ✅ DEPLOYED! Wait 2-3 minutes for Render to redeploy.
pause
