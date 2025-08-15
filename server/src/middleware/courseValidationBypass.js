/**
 * Middleware to handle course creation without validation errors
 */

/**
 * Bypasses mode validation for faculty courses
 */
function bypassModeValidation(req, res, next) {
  const originalSave = req.app.models.Faculty.prototype.save;
  
  // Override Faculty save method temporarily
  req.app.models.Faculty.prototype.save = async function() {
    try {
      // Try normal save
      return await originalSave.apply(this, arguments);
    } catch (error) {
      // Check if it's a mode validation error
      if (error.name === 'ValidationError' && 
          error.errors && 
          error.errors['courses.0.mode'] && 
          error.errors['courses.0.mode'].kind === 'enum') {
        
        console.log('🔧 Detected mode validation error, applying fix...');
        const invalidMode = error.errors['courses.0.mode'].value;
        console.log(`🔧 Invalid mode: "${invalidMode}"`);
        
        // Fix the invalid mode directly in the database
        if (this.courses && this.courses.length > 0) {
          const lastCourse = this.courses[this.courses.length - 1];
          if (lastCourse && lastCourse.mode === invalidMode) {
            console.log(`🔧 Setting mode from "${lastCourse.mode}" to "Live Watching"`);
            lastCourse.mode = 'Live Watching';
            
            // Try saving again
            console.log('🔧 Retrying save with fixed mode...');
            return await originalSave.apply(this, arguments);
          }
        }
      }
      
      // If not a mode error or fix failed, rethrow
      throw error;
    }
  };
  
  // Continue with the request
  next();
  
  // Restore original save after request is complete
  res.on('finish', () => {
    req.app.models.Faculty.prototype.save = originalSave;
  });
}

module.exports = {
  bypassModeValidation
};
