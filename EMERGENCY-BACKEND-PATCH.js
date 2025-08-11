// EMERGENCY BACKEND PATCH - Add this to your deployed app.js on Render

// Add this right after your existing routes (around line 300-400)

// EMERGENCY COURSE CREATION ENDPOINT - WORKING VERSION
app.post('/api/admin/courses/standalone', upload.single('poster'), async (req, res) => {
  try {
    console.log('🎯 EMERGENCY Course creation endpoint hit');
    console.log('📋 Body:', req.body);
    console.log('📎 File:', req.file);

    const {
      title, subject, description, category, subcategory, paperId, paperName,
      courseType, noOfLecture, books, videoLanguage, videoRunOn, timing,
      doubtSolving, supportMail, supportCall, validityStartFrom,
      facultySlug, facultyName, institute, modeAttemptPricing,
      costPrice, sellingPrice, isStandalone
    } = req.body;

    // Use existing cloudinary upload logic
    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';

    // Determine course type
    const courseIsStandalone = isStandalone === 'true' || isStandalone === true;

    console.log('🔍 Course type:', courseIsStandalone ? 'STANDALONE' : 'FACULTY');

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    if (courseIsStandalone && !title) {
      return res.status(400).json({ error: 'Title is required for standalone courses' });
    }

    // Parse pricing
    let parsedModeAttemptPricing = [];
    if (modeAttemptPricing) {
      try {
        parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid pricing format' });
      }
    }

    if (courseIsStandalone) {
      console.log('🎓 Creating STANDALONE course');
      // Create standalone course using existing Course model
      const Course = require('./src/model/Course.model'); // Adjust path if needed
      
      const newCourse = new Course({
        title,
        subject,
        description: description || '',
        category: category || '',
        subcategory: subcategory || '',
        paperId: paperId || '',
        paperName: paperName || '',
        courseType: courseType || 'General Course',
        noOfLecture: noOfLecture || '',
        books: books || '',
        videoLanguage: videoLanguage || 'Hindi',
        videoRunOn: videoRunOn || '',
        timing: timing || '',
        doubtSolving: doubtSolving || '',
        supportMail: supportMail || '',
        supportCall: supportCall || '',
        validityStartFrom: validityStartFrom || '',
        facultySlug: facultySlug || '',
        facultyName: facultyName || '',
        institute: institute || '',
        posterUrl,
        posterPublicId,
        modeAttemptPricing: parsedModeAttemptPricing,
        costPrice: costPrice ? Number(costPrice) : 0,
        sellingPrice: sellingPrice ? Number(sellingPrice) : 0,
        isStandalone: true,
        isActive: true
      });

      const savedCourse = await newCourse.save();
      console.log('✅ STANDALONE course saved with ID:', savedCourse._id);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Standalone course created successfully',
        course: savedCourse 
      });
    } else {
      console.log('👨‍🏫 Creating FACULTY course');
      // Create faculty-based course
      const Faculty = require('./src/model/Faculty.model'); // Adjust path if needed
      
      if (!facultySlug) {
        return res.status(400).json({ error: 'Faculty slug required for faculty courses' });
      }

      const faculty = await Faculty.findOne({ slug: facultySlug });
      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      const courseData = {
        title: title || paperName || subject,
        subject,
        description: description || '',
        category: category || '',
        subcategory: subcategory || '',
        paperId: paperId || '',
        paperName: paperName || '',
        courseType: courseType || 'General Course',
        noOfLecture: noOfLecture || '',
        books: books || '',
        videoLanguage: videoLanguage || 'Hindi',
        videoRunOn: videoRunOn || '',
        timing: timing || '',
        doubtSolving: doubtSolving || '',
        supportMail: supportMail || '',
        supportCall: supportCall || '',
        validityStartFrom: validityStartFrom || '',
        facultySlug: facultySlug,
        facultyName: facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
        institute: institute || '',
        posterUrl,
        posterPublicId,
        modeAttemptPricing: parsedModeAttemptPricing,
        costPrice: costPrice ? Number(costPrice) : 0,
        sellingPrice: sellingPrice ? Number(sellingPrice) : 0,
        createdAt: new Date()
      };

      faculty.courses.push(courseData);
      await faculty.save();
      console.log('✅ FACULTY course saved to:', faculty.slug);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Faculty-based course created successfully',
        course: courseData,
        faculty: faculty.slug
      });
    }
  } catch (error) {
    console.error('❌ EMERGENCY Course creation error:', error);
    return res.status(500).json({ error: error.message });
  }
});
