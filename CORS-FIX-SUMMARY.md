# CORS Configuration Fix

## Problem Identified

When attempting to add a course, we're seeing a CORS error:

```
Response body is not available to scripts (Reason: CORS Missing Allow Origin)
```

## Root Cause

1. Multiple competing CORS configurations in app.js
2. Incomplete CORS headers for complex requests (like file uploads)
3. Missing Content-Length in allowedHeaders

## Changes Made

### 1. Consolidated CORS Configuration

- Removed first CORS configuration that was too restrictive
- Enhanced the second CORS configuration with more comprehensive settings

### 2. Enhanced CORS Headers

```javascript
app.use(
  cors({
    origin: [
      "https://academywale.com",
      "https://www.academywale.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Content-Length",
    ],
    exposedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 86400, // 24 hours
  })
);
```

### 3. Added Request Logging

Added middleware to log all incoming requests with their origin for debugging:

```javascript
app.use((req, res, next) => {
  console.log(
    `🌐 ${req.method} request from origin: ${
      req.headers.origin || "unknown"
    } to ${req.path}`
  );
  next();
});
```

## Expected Results

1. Cross-origin requests from www.academywale.com to academywale-lms.onrender.com should work
2. File uploads in faculty and course creation should succeed
3. Preflight OPTIONS requests should be properly handled

## Testing Steps

1. After deployment, try adding a faculty member
2. Try adding a course
3. Check server logs to see if requests are coming through with proper origins
4. Verify no more CORS errors in the browser console
