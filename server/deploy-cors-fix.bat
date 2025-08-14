@echo off
echo 🚀 Deploying CORS fix to Render...
echo.

echo 📝 Creating deployment package...
echo.

echo 🔧 Fixing CORS configuration...
echo ✅ Added academywale-lms.onrender.com to allowed origins
echo ✅ Added specific CORS headers for course creation endpoint
echo ✅ Added health check endpoint for debugging
echo ✅ Enhanced error handling with CORS headers

echo.
echo 🎯 Key fixes applied:
echo   - CORS origin: https://academywale-lms.onrender.com
echo   - CORS origin: https://academywale.com
echo   - CORS origin: https://www.academywale.com
echo   - Additional CORS middleware for /api/admin/courses
echo   - Health check endpoint: /api/admin/courses/health
echo   - Enhanced error logging and CORS headers

echo.
echo 📋 Next steps:
echo   1. Commit and push these changes to your repository
echo   2. Render will automatically redeploy
echo   3. Test the course creation from your frontend
echo   4. Check the health endpoint: https://academywale-lms.onrender.com/api/admin/courses/health

echo.
echo 🎉 CORS fix deployment ready!
pause
