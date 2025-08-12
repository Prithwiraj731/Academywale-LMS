@echo off
echo Testing AcademyWale Backend Endpoints...
echo.

echo 1. Testing /health endpoint...
curl -X GET "https://academywale.onrender.com/health" -H "Accept: application/json"
echo.
echo.

echo 2. Testing /test endpoint...
curl -X GET "https://academywale.onrender.com/test" -H "Accept: application/json"
echo.
echo.

echo 3. Testing /api/test/course endpoint...
curl -X POST "https://academywale.onrender.com/api/test/course" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"courseName\":\"Test Course\",\"courseType\":\"standalone\"}"
echo.
echo.

echo 4. Testing /api/faculties endpoint...
curl -X GET "https://academywale.onrender.com/api/faculties" -H "Accept: application/json"
echo.
echo.

echo 5. Testing /api/institutes endpoint...
curl -X GET "https://academywale.onrender.com/api/institutes" -H "Accept: application/json"
echo.
echo.

echo Test completed!
pause
