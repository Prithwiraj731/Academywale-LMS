# CLOUDINARY API KEY EMERGENCY FIX

## Current Error

```
{"success":false,"error":"Server Error","message":"Unknown API key 959547171781827"}
```

## Root Cause Analysis

We're still seeing the error with the unknown API key, which means:

1. The application is still using the old Cloudinary API key (`959547171781827`) somewhere
2. This is likely happening because Render is:
   - Either using cached Node modules
   - Or environment variables are overriding our hardcoded configuration
   - Or there might be another file we haven't found that's configuring Cloudinary

## Immediate Action Plan

### 1. Update Render Environment Variables

First, ensure Render has the correct environment variables:

```
CLOUDINARY_API_KEY=367882575567196
CLOUDINARY_CLOUD_NAME=drlqhsjgm
CLOUDINARY_API_SECRET=RdSBwyzQRUb5ZD32kbqS3vhxh7I
```

### 2. Deploy Emergency Fix

The `deploy-cloudinary-fix.bat` script:

1. Creates an emergency Cloudinary config file with hardcoded correct credentials
2. Creates a require statement that can be added at the top of app.js
3. Pushes these files to the repository

### 3. Manual Fix if Needed

If the automatic fix doesn't work:

1. Log into Render dashboard
2. Open shell/console for the backend service
3. Run: `cd /opt/render/project/src/server`
4. Edit app.js directly to include at the top:
   ```javascript
   // EMERGENCY CLOUDINARY FIX - HARDCODED CREDENTIALS
   const cloudinary = require("cloudinary").v2;
   cloudinary.config({
     cloud_name: "drlqhsjgm",
     api_key: "367882575567196",
     api_secret: "RdSBwyzQRUb5ZD32kbqS3vhxh7I",
     secure: true,
   });
   console.log("☁️ EMERGENCY CLOUDINARY CONFIG APPLIED!");
   ```

### 4. Clear Build Cache

After making changes:

1. Go to backend service on Render
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

## Verification Steps

1. Check logs to ensure the message "☁️ EMERGENCY CLOUDINARY CONFIG APPLIED!" appears
2. Test faculty creation at https://academywale.com/admin/faculty
3. Verify no more "Unknown API key" errors

## Long-term Fix

After this emergency fix:

1. Do a comprehensive audit of all Cloudinary configuration
2. Unify under a single config file
3. Use environment variables with proper defaults
4. Remove all hardcoded API keys from the codebase
