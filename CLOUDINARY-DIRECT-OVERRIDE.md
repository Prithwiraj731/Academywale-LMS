# CLOUDINARY DIRECT OVERRIDE FIX

## Problem

We're still seeing `Unknown API key 959547171781827` error when adding faculty images.

## New Approach

Since our previous attempts haven't worked, we've taken a more direct approach:

1. **Direct Override in Faculty Routes**

   - Created a new Cloudinary configuration directly within faculty.routes.js
   - Created a new CloudinaryStorage instance within the same file
   - This bypasses all external configuration files

2. **Test Routes for Verification**
   - Added new test endpoints at `/api/test/cloudinary` and `/api/test/cloudinary-upload`
   - These will help diagnose the configuration state

## How This Works

The direct override approach ensures that the faculty routes use the correct configuration even if:

- Environment variables have the wrong values
- Other configuration files are cached with old values
- Module initialization order is causing issues

## Testing

1. After deployment, test these endpoints:

   - GET `/api/test/cloudinary` - Checks current configuration
   - POST `/api/test/cloudinary-upload` - Tests actual upload

2. If these endpoints work but faculty creation still fails, we'll need to:
   - Check for other routes using old configuration
   - Examine request headers and payload formats

## Next Steps

After verifying this fix works:

- Clean up duplicate configuration files
- Standardize on a single configuration approach
- Use environment variables properly
