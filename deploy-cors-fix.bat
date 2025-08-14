@echo off
echo ===================================
echo DEPLOYING CORS AND CLOUDINARY FIX
echo ===================================

echo 1. Fixing CORS and Cloudinary Issues...
echo - Consolidated CORS configuration
echo - Enhanced CORS options for cross-site requests
echo - Added request origin logging for debugging
echo - Using emergency Cloudinary instance for all uploads

echo 2. Pushing changes to Git...
git add server\app.js
git add server\cloudinary-emergency-fix.js
git add server\src\routes\cloudinary-test.routes.js
git add server\src\routes\faculty.routes.js
git commit -m "Fix CORS and Cloudinary configuration"
git push

echo ===================================
echo DEPLOYMENT STEPS COMPLETED
echo ===================================
echo Next steps:
echo 1. Wait for Render deployment to finish
echo 2. Test faculty creation at https://academywale.com/admin/faculty
echo 3. Test course creation at https://academywale.com/admin/courses
echo ===================================
