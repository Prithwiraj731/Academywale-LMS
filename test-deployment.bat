@echo off
echo 🔍 TESTING ACADEMYWALE BACKEND DEPLOYMENT...
echo.

echo 🌐 Testing health endpoint...
curl -s https://academywale-lms.onrender.com/health
echo.

echo 🔐 Testing auth test endpoint...
curl -s https://academywale-lms.onrender.com/api/auth/test
echo.

echo 📝 Testing signup endpoint (should return validation error, not 404)...
curl -s -X POST https://academywale-lms.onrender.com/api/auth/signup -H "Content-Type: application/json" -d "{}"
echo.

echo ✅ Testing complete!
echo.
echo If you see JSON responses (not 404 errors), your deployment is working!
echo.
pause 