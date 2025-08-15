# Course Mode Validation Fix

## Problem

When adding a course to a faculty, validation fails with the following error:

```
"Live at Home With Hard Copy" is not a valid enum value for path `mode`.
```

This is happening because the Faculty model's course schema has a restricted list of allowed mode values:

- Live Watching
- Recorded Videos

## Solution

### 1. Faculty Model Update

We've updated the Faculty model to include additional mode options:

- Live Watching
- Recorded Videos
- Live at Home With Hard Copy
- Self Study

### 2. Course Utilities

We've created a new utility function `validateCourseMode` that:

- Checks if the course mode is valid
- Automatically fixes invalid modes to "Live Watching"
- Logs warnings when it fixes modes
- Ensures consistency between mode, modes array, and modeAttemptPricing

### 3. Controller Updates

The course controller now:

- Uses the utility function to validate and fix modes
- Has improved error handling for validation issues
- Will automatically fix invalid modes instead of rejecting the request

## Testing

After deploying this fix, you can test it by creating courses with the following modes:

- Live Watching (will work)
- Recorded Videos (will work)
- Live at Home With Hard Copy (will now work)
- Self Study (will now work)
- Any other mode (will be automatically fixed to "Live Watching")

## Long-term Recommendations

In the future, consider:

1. Using a more flexible schema design that doesn't enforce enum values on modes
2. Adding a configuration file for allowed modes that can be updated without code changes
3. Creating a separate collection for modes and pricing models
