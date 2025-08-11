@echo off
echo Deploying to Render...
echo.
echo Step 1: Pushing to Git (Render auto-deploys from Git)
git add .
git commit -m "Fix course creation endpoints and unified all courses page"
git push origin main

echo.
echo Step 2: Waiting for Render deployment...
echo Please check your Render dashboard at: https://dashboard.render.com/
echo Your backend should redeploy automatically within 1-2 minutes
echo.

echo Step 3: Testing the deployment
echo Once deployed, try adding a course again!
echo.

pause
