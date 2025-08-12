// Minimal Course Creation Endpoint - Debug Version
// This is a simplified version to isolate the issue

app.post('/api/admin/courses/standalone/debug', async (req, res) => {
  try {
    console.log('🔍 DEBUG: Course creation request received');
    console.log('📋 DEBUG: Request body:', req.body);
    
    // Basic validation only
    const { title, subject } = req.body;
    
    if (!subject) {
      return res.status(400).json({ 
        error: 'Subject is required',
        debug: 'Validation failed' 
      });
    }
    
    // Create minimal course object
    const minimalCourse = {
      title: title || 'Debug Course',
      subject: subject,
      description: 'Debug course creation',
      isStandalone: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log('🔍 DEBUG: Creating minimal course:', minimalCourse);
    
    // Try to save to database
    const newCourse = new Course(minimalCourse);
    const savedCourse = await newCourse.save();
    
    console.log('✅ DEBUG: Course saved successfully:', savedCourse._id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Debug course created successfully',
      course: savedCourse,
      debug: 'All validations passed'
    });
    
  } catch (error) {
    console.error('❌ DEBUG: Error occurred:', error);
    console.error('❌ DEBUG: Error name:', error.name);
    console.error('❌ DEBUG: Error message:', error.message);
    console.error('❌ DEBUG: Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Debug course creation failed',
      message: error.message,
      name: error.name,
      debug: 'Error caught in debug endpoint'
    });
  }
});
