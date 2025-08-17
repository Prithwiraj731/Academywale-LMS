@echo off
echo ========================================
echo Course Display Fix Deployment
echo ========================================
echo.
echo Starting server with proper CORS settings...

cd %~dp0\server
node app.js
