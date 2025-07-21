const Purchase = require('../model/Purchase.model');
const Faculty = require('../model/Faculty.model');
const User = require('../model/User.model');
const { sendPurchaseInvoiceEmail } = require('../utils/email.utils');

// Generate unique transaction ID
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Purchase a course
exports.purchaseCourse = async (req, res) => {
  try {
    const { userId, facultyName, courseIndex, paymentMethod = 'online', amount } = req.body;

    // Validate required fields
    if (!userId || !facultyName || courseIndex === undefined || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, facultyName, courseIndex, amount'
      });
    }

    // Find the faculty
    const firstName = facultyName.split(' ')[0].toUpperCase();
    const faculty = await Faculty.findOne({ firstName });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // Check if course exists
    if (!faculty.courses[courseIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already purchased this course
    const existingPurchase = await Purchase.findOne({
      userId,
      facultyId: faculty._id,
      courseIndex,
      isActive: true
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this course'
      });
    }

    // Create purchase record
    const purchase = new Purchase({
      userId,
      facultyId: faculty._id,
      courseIndex,
      courseDetails: faculty.courses[courseIndex],
      paymentMethod,
      amount,
      transactionId: generateTransactionId(),
      paymentStatus: 'completed' // For now, assume payment is successful
    });

    await purchase.save();

    // Send invoice email to student
    try {
      const user = await User.findById(userId);
      if (user && user.email) {
        await sendPurchaseInvoiceEmail(
          user.email,
          user.name,
          faculty.courses[courseIndex],
          purchase.transactionId,
          purchase.purchaseDate,
          amount
        );
      }
    } catch (emailErr) {
      console.error('Failed to send invoice email:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Course purchased successfully!',
      purchase: {
        id: purchase._id,
        transactionId: purchase.transactionId,
        courseDetails: purchase.courseDetails,
        purchaseDate: purchase.purchaseDate,
        accessExpiry: purchase.accessExpiry
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase course',
      error: error.message
    });
  }
};

// Get user's purchased courses
exports.getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    const purchases = await Purchase.find({
      userId,
      isActive: true
    }).populate('facultyId', 'firstName lastName').sort({ purchaseDate: -1 });

    const formattedPurchases = purchases.map(purchase => ({
      id: purchase._id,
      transactionId: purchase.transactionId,
      courseDetails: purchase.courseDetails,
      purchaseDate: purchase.purchaseDate,
      accessExpiry: purchase.accessExpiry,
      paymentStatus: purchase.paymentStatus,
      amount: purchase.amount,
      facultyName: purchase.facultyId ? `${purchase.facultyId.firstName} ${purchase.facultyId.lastName || ''}`.trim() : purchase.courseDetails.facultyName,
      isExpired: new Date() > purchase.accessExpiry
    }));

    res.status(200).json({
      success: true,
      purchases: formattedPurchases
    });

  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchases',
      error: error.message
    });
  }
};

// Check if user has purchased a specific course
exports.checkCoursePurchase = async (req, res) => {
  try {
    const { userId, facultyName, courseIndex } = req.params;

    const firstName = facultyName.split(' ')[0].toUpperCase();
    const faculty = await Faculty.findOne({ firstName });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    const purchase = await Purchase.findOne({
      userId,
      facultyId: faculty._id,
      courseIndex,
      isActive: true,
      paymentStatus: 'completed'
    });

    if (!purchase) {
      return res.status(200).json({
        success: true,
        hasPurchased: false
      });
    }

    const isExpired = new Date() > purchase.accessExpiry;

    res.status(200).json({
      success: true,
      hasPurchased: true,
      isExpired,
      purchase: {
        id: purchase._id,
        transactionId: purchase.transactionId,
        purchaseDate: purchase.purchaseDate,
        accessExpiry: purchase.accessExpiry
      }
    });

  } catch (error) {
    console.error('Check purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check purchase status',
      error: error.message
    });
  }
};

// Get purchase statistics for admin
exports.getPurchaseStats = async (req, res) => {
  try {
    const totalPurchases = await Purchase.countDocuments({ isActive: true });
    const completedPurchases = await Purchase.countDocuments({ 
      isActive: true, 
      paymentStatus: 'completed' 
    });
    const totalRevenue = await Purchase.aggregate([
      { $match: { isActive: true, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPurchases,
        completedPurchases,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
}; 