/**
 * Utility functions for course handling
 */

/**
 * Ensures the course mode is valid according to the schema
 * @param {Object} courseData - The course data object
 * @returns {Object} - The validated and fixed course data
 */
function validateCourseMode(courseData) {
    // Valid modes according to schema
    const validModes = ['Live Watching', 'Recorded Videos', 'Live at Home With Hard Copy', 'Self Study'];
    
    // Check if mode exists and is not valid
    if (courseData.mode && !validModes.includes(courseData.mode)) {
        console.log(`⚠️ Invalid mode detected: "${courseData.mode}". Fixing to "Live Watching"`);
        
        // Fix the mode
        courseData.mode = 'Live Watching';
    }
    
    // Check modeAttemptPricing array if it exists
    if (courseData.modeAttemptPricing && Array.isArray(courseData.modeAttemptPricing)) {
        // Ensure each mode in the array is valid or fix it
        courseData.modeAttemptPricing.forEach(modeItem => {
            if (modeItem.mode && !validModes.includes(modeItem.mode)) {
                console.log(`⚠️ Invalid mode in pricing: "${modeItem.mode}". Adding to allowed modes.`);
                
                // Fix modes array if it exists
                if (courseData.modes && Array.isArray(courseData.modes)) {
                    // Remove invalid mode from modes array
                    courseData.modes = courseData.modes.filter(m => validModes.includes(m));
                    
                    // Add Live Watching if it's not already there
                    if (!courseData.modes.includes('Live Watching')) {
                        courseData.modes.push('Live Watching');
                    }
                }
            }
        });
    }
    
    return courseData;
}

module.exports = {
    validateCourseMode
};
