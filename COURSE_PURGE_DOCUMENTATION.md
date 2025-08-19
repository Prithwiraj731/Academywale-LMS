# Emergency Course Purge Implementation

## Overview

This document describes the implementation of an emergency course purge mechanism to completely remove all courses from the system. This was implemented on August 19, 2025 to ensure that no hardcoded or default courses remain in the system.

## Implementation Details

### 1. Backend API Endpoint

A new API endpoint was created to delete all courses from all faculties:

```javascript
// In course.controller.js
exports.deleteAllCourses = async (req, res) => {
  try {
    // Find all faculties
    const faculties = await Faculty.find({});
    const totalFaculties = faculties.length;
    let totalCoursesRemoved = 0;

    // For each faculty, empty their courses array
    for (const faculty of faculties) {
      totalCoursesRemoved += faculty.courses ? faculty.courses.length : 0;
      faculty.courses = []; // Remove all courses
      await faculty.save();
    }

    res.status(200).json({
      success: true,
      message: `Successfully removed all courses from all faculties`,
      details: {
        facultiesAffected: totalFaculties,
        coursesRemoved: totalCoursesRemoved,
      },
    });
  } catch (error) {
    console.error("Error deleting all courses:", error);
    res.status(500).json({ error: error.message });
  }
};
```

### 2. API Route

Added a new route to the course routes file:

```javascript
// In course.routes.js
router.delete(
  "/api/admin/courses/deleteAll/confirm",
  courseController.deleteAllCourses
);
```

### 3. Utility Script

Created a Node.js utility script to execute the API call:

```javascript
// purge-all-courses.js
async function purgeAllCourses() {
  const API_URL = process.env.BACKEND_URL || "http://localhost:3000";
  const endpoint = `${API_URL}/api/admin/courses/deleteAll/confirm`;

  try {
    const response = await fetch(endpoint, { method: "DELETE" });
    // Handle response...
  } catch (error) {
    console.error("Error executing purge request:", error);
  }
}
```

### 4. Batch Script

Created a batch script with confirmation prompt for safety:

```batch
@echo off
echo =============================================
echo EMERGENCY: PURGE ALL COURSES FROM THE SYSTEM
echo =============================================

set /p confirm=Are you absolutely sure you want to continue? (yes/no):

if /i "%confirm%" NEQ "yes" (
  echo Operation cancelled.
  exit /b
)

node purge-all-courses.js
```

## Execution Instructions

1. Navigate to the root directory of the project
2. Run the `EMERGENCY-PURGE-ALL-COURSES.bat` script
3. Confirm the operation by typing "yes" when prompted
4. The script will connect to the API and delete all courses from all faculties

## Verification

After running the script, you should:

1. Check that no courses appear in the admin dashboard
2. Verify that no courses appear in CA or CMA paper detail pages
3. Confirm that only newly added courses (after the purge) are visible

## Note

This is a destructive operation that cannot be undone. It will remove ALL courses from the system, allowing for a fresh start with only admin-created courses.
