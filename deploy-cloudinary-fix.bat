@echo off
echo ===================================
echo DEPLOYING CLOUDINARY CONFIG FIX
echo ===================================

echo 1. Pushing changes to Git...
git add server\app.js
git add server\app-working-fix.js
git commit -m "Fix Cloudinary API key issue and mount faculty routes properly"
git push

echo 2. Triggering Render deployment...
echo Deployment triggered automatically by Git push

echo ===================================
echo DEPLOYMENT STEPS COMPLETED
echo ===================================
echo Next steps:
echo 1. Wait for Render deployment to finish
echo 2. Test faculty creation at https://academywale.com/admin/faculty
echo 3. Verify no more "Unknown API key" errors
echo ===================================
