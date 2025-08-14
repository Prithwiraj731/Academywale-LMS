@echo off
echo 🚀 EMERGENCY COURSE CREATION FIX DEPLOYMENT
echo ===========================================
echo.
echo ✅ FIXED ISSUES:
echo - Added debug endpoints for course creation
echo - Enhanced error handling for Multer and validation errors
echo - Added detailed logging for request/response debugging
echo - Created browser-based testing tool
echo.
echo 📋 WHAT TO DO NOW:
echo.
echo 1. Run this batch file to push changes to GitHub
echo 2. Wait for Render to automatically deploy the changes
echo 3. Test using the browser-based testing tool
echo.
echo 🎯 EXPECTED RESULTS:
echo ✅ Detailed error reporting in server logs
echo ✅ Successful file uploads with Cloudinary integration
echo ✅ CORS issues resolved for cross-origin requests
echo ✅ Clear identification of exactly what's failing
echo.
echo 🧪 TEST ENDPOINTS:
echo - Browser Test: https://www.academywale.com/course-creation-test.html
echo - Simple Test: POST https://academywale-lms.onrender.com/api/debug/courses/test
echo - Debug Test: POST https://academywale-lms.onrender.com/api/debug/courses
echo - Main Endpoint: POST https://academywale-lms.onrender.com/api/admin/courses
echo.
echo 💡 After deployment, use the browser testing tool to diagnose the issue!

echo 2. Pushing changes to Git...
git add server\app.js
git add server\src\routes\debug-courses.routes.js
git add client\public\course-creation-test.html
git commit -m "Fix course creation with debug endpoints and testing tools"
git push

pause
