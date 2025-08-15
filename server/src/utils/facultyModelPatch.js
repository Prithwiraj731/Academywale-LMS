// Direct mode patch for Faculty model
// This file will directly modify the Faculty model schema to accept all mode values

module.exports = function() {
  try {
    // Get the Faculty model
    const mongoose = require('mongoose');
    const Faculty = mongoose.model('Faculty');
    
    // Access and modify the schema
    if (Faculty && Faculty.schema) {
      // Check if the path exists
      const coursePath = Faculty.schema.path('courses');
      
      if (coursePath && coursePath.schema) {
        // Access the embedded course schema
        const courseSchema = coursePath.schema;
        
        // Check if the mode path exists
        const modePath = courseSchema.path('mode');
        
        if (modePath && modePath.enumValues) {
          console.log('🔧 DIRECT SCHEMA PATCH: Current allowed modes:', modePath.enumValues);
          
          // Add the new values if they don't exist
          const newModes = ['Live at Home With Hard Copy', 'Self Study'];
          
          newModes.forEach(mode => {
            if (!modePath.enumValues.includes(mode)) {
              modePath.enumValues.push(mode);
              console.log(`✅ DIRECT SCHEMA PATCH: Added "${mode}" to allowed modes`);
            }
          });
          
          console.log('🔧 DIRECT SCHEMA PATCH: Updated allowed modes:', modePath.enumValues);
        } else {
          console.log('⚠️ DIRECT SCHEMA PATCH: Could not find mode path in course schema');
        }
      } else {
        console.log('⚠️ DIRECT SCHEMA PATCH: Could not find courses schema in Faculty model');
      }
    } else {
      console.log('⚠️ DIRECT SCHEMA PATCH: Faculty model or schema not found');
    }
    
    // Return success
    return true;
  } catch (error) {
    console.error('❌ DIRECT SCHEMA PATCH ERROR:', error);
    return false;
  }
};
