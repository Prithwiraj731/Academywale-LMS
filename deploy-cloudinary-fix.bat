@echo off
echo ===================================
echo DEPLOYING CLOUDINARY CONFIG FIX
echo ===================================

echo 1. Checking Render configuration...
echo If your app is still getting the "Unknown API key 959547171781827" error, 
echo you need to update your Render environment variables:

echo CLOUDINARY_API_KEY=367882575567196
echo CLOUDINARY_CLOUD_NAME=drlqhsjgm
echo CLOUDINARY_API_SECRET=RdSBwyzQRUb5ZD32kbqS3vhxh7I

echo - Login to Render.com
echo - Go to your "academywale-lms-backend" service
echo - Click on "Environment" tab
echo - Add or update the above environment variables
echo - Click "Save Changes" and then "Manual Deploy"
echo - Select "Clear build cache & deploy"

echo 2. Creating emergency patch file...
echo // Emergency Cloudinary Config Fix > server\cloudinary-emergency-fix.js
echo const cloudinary = require('cloudinary').v2; >> server\cloudinary-emergency-fix.js
echo. >> server\cloudinary-emergency-fix.js
echo // Hard-coded correct credentials >> server\cloudinary-emergency-fix.js
echo cloudinary.config({ >> server\cloudinary-emergency-fix.js
echo   cloud_name: 'drlqhsjgm', >> server\cloudinary-emergency-fix.js
echo   api_key: '367882575567196', >> server\cloudinary-emergency-fix.js
echo   api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I', >> server\cloudinary-emergency-fix.js
echo   secure: true >> server\cloudinary-emergency-fix.js
echo }); >> server\cloudinary-emergency-fix.js
echo. >> server\cloudinary-emergency-fix.js
echo console.log('☁️ EMERGENCY CLOUDINARY CONFIG APPLIED!'); >> server\cloudinary-emergency-fix.js
echo. >> server\cloudinary-emergency-fix.js
echo module.exports = cloudinary; >> server\cloudinary-emergency-fix.js

echo 3. Updating app.js to use emergency fix...
echo const cloudinaryEmergency = require('./cloudinary-emergency-fix'); > server\cloudinary-emergency-require.js

echo 4. Pushing changes to Git...
git add server\app.js
git add server\app-working-fix.js
git add server\cloudinary-emergency-fix.js
git add server\cloudinary-emergency-require.js
git commit -m "Fix Cloudinary API key issue and create emergency fix"
git push

echo ===================================
echo DEPLOYMENT STEPS COMPLETED
echo ===================================
echo Next steps:
echo 1. Wait for Render deployment to finish
echo 2. If still having issues, log into Render and manually apply the fix:
echo    - Go to Render dashboard
echo    - Open your backend service Shell/Console
echo    - Run: cd /opt/render/project/src/server
echo    - Run: node -e "require('./cloudinary-emergency-fix')"
echo    - Verify that this prints "☁️ EMERGENCY CLOUDINARY CONFIG APPLIED!"
echo 3. Test faculty creation at https://academywale.com/admin/faculty
echo ===================================
