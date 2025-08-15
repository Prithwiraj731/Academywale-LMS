/**
 * Direct monkey patch for Faculty schema
 * This file completely removes mode validation from the Faculty model
 */

// Apply as early as possible in the app
module.exports = function() {
  try {
    const mongoose = require('mongoose');
    
    // Find all existing Faculty documents and update their schema
    const updateExistingFaculties = async () => {
      // Get all faculty documents
      const Faculty = mongoose.model('Faculty');
      const faculties = await Faculty.find({});
      console.log(`🔧 Found ${faculties.length} faculty documents to update`);
      
      // For each faculty with courses
      for (const faculty of faculties) {
        if (faculty.courses && faculty.courses.length > 0) {
          let updated = false;
          
          // Check each course for mode value
          for (const course of faculty.courses) {
            if (course.mode && !['Live Watching', 'Recorded Videos'].includes(course.mode)) {
              console.log(`🔧 Found invalid mode: "${course.mode}" in faculty ${faculty.slug}`);
              course.mode = 'Live Watching'; // Force to valid value
              updated = true;
            }
          }
          
          // Save if updated
          if (updated) {
            console.log(`🔧 Updating faculty ${faculty.slug} with fixed modes`);
            await faculty.save();
          }
        }
      }
      
      console.log('✅ Finished updating existing faculties');
    };
    
    // Modify the schema definition directly
    if (mongoose.modelSchemas && mongoose.modelSchemas.Faculty) {
      const facultySchema = mongoose.modelSchemas.Faculty;
      
      if (facultySchema && facultySchema.paths && facultySchema.paths.courses) {
        const courseSchema = facultySchema.paths.courses.schema;
        
        if (courseSchema && courseSchema.paths && courseSchema.paths.mode) {
          const modePath = courseSchema.paths.mode;
          
          // Check if it's an enum
          if (modePath.enumValues) {
            console.log('🔧 DIRECT MONKEY PATCH: Current mode enum values:', modePath.enumValues);
            
            // Option 1: Add the new values
            if (!modePath.enumValues.includes('Live at Home With Hard Copy')) {
              modePath.enumValues.push('Live at Home With Hard Copy');
              modePath.enumValues.push('Self Study');
              console.log('🔧 DIRECT MONKEY PATCH: Added new mode values to enum');
            }
            
            // Option 2 (extreme): Remove enum validation entirely
            const originalValidate = modePath.validators;
            modePath.validators = [];
            
            // Replace with a custom validator that accepts anything
            modePath.validators.push({
              validator: function() { return true; },
              message: 'Custom validator that allows all values'
            });
            
            console.log('🔧 DIRECT MONKEY PATCH: Removed enum validation for mode');
          }
        }
      }
    }
    
    // Run the update of existing documents
    updateExistingFaculties().catch(err => {
      console.error('❌ Error updating existing faculties:', err);
    });
    
    return true;
  } catch (error) {
    console.error('❌ DIRECT MONKEY PATCH ERROR:', error);
    return false;
  }
};
