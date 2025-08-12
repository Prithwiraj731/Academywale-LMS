@echo off
echo ================================
echo CRITICAL FIXES DEPLOYMENT
echo ================================

cd /d "e:\AcademyWale\server"

echo Adding all changes...
git add -A

echo Committing critical fixes...
git commit -m "CRITICAL: Global JSON error handler + bulletproof course creation + faculty courses route"

echo Pushing to Render...
git push origin main

echo ================================
echo CRITICAL FIXES DEPLOYED!
echo Wait 2-3 minutes for rebuild
echo ================================

echo.
echo FIXES APPLIED:
echo 1. Global JSON error handler (no more HTML errors)
echo 2. Bulletproof course creation with all fields
echo 3. Faculty-specific courses route
echo 4. Enhanced validation and error handling
echo.

pause
