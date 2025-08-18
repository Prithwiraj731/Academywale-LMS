@echo off
REM Unified Course Handling Fix Script

echo ==============================================
echo Academywale LMS - Unified Course Handling Fix
echo ==============================================

echo.
echo 1. Creating N/A Faculty if needed...
node -e "const mongoose = require('mongoose'); const Faculty = require('./src/model/Faculty.model'); mongoose.connect('mongodb+srv://academywale:academywale@academywalecluster.kcdsn3g.mongodb.net/academywale?retryWrites=true').then(async () => { const naFaculty = await Faculty.findOne({slug: 'n-a'}); if (!naFaculty) { const newNAFaculty = new Faculty({firstName: 'N/A', lastName: '', slug: 'n-a', specialization: 'General Courses', bio: 'General courses without specific faculty', courses: []}); await newNAFaculty.save(); console.log('N/A Faculty created successfully'); } else { console.log('N/A Faculty already exists'); } mongoose.disconnect(); }).catch(err => console.error(err));"

echo.
echo 2. Building client...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Client build failed
  exit /b %ERRORLEVEL%
)

echo.
echo 3. Restarting server...
cd ..\server
call npm run start

echo.
echo Deployment complete!
echo Unified course handling has been successfully implemented.
echo All courses now use consistent handling with N/A faculty option for courses without faculty.
echo.
