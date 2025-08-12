@echo off
echo ================================
echo DEPLOYING SIMPLIFIED COURSE CREATION
echo ================================

cd /d "e:\AcademyWale\server"

echo Adding files to git...
git add .

echo Committing changes...
git commit -m "SIMPLE COURSE CREATION - minimal validation, default values"

echo Pushing to render...
git push origin main

echo ================================
echo DEPLOYMENT COMPLETE
echo Wait 2-3 minutes for Render rebuild
echo ================================
pause
