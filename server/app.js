const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConnection = require('./src/config/db.config');
const path = require('path'); // <-- FIX: Import the built-in 'path' module

// // --- FIX: Pre-register models to prevent population errors ---
// // require('./src/model/Course.model');
require('./src/model/User.model');
// // require('./src/model/Address.model');

// // Load .env variables from the root project directory
// // FIX: Replace the old dotenv.config() with this line
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // Initialize App
// const app = express();

// // Enable CORS for frontend (Vite runs on port 5173)
// app.use(cors({
//   origin: [
//     'https://academywale.com',
//     'https://www.academywale.com',
//     'https://academywale-lms.vercel.app',
//     'http://localhost:5173',
//     'http://localhost:5174'
//   ],
//   credentials: true
// }));

// // Body Parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Test Route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Routes
// // const adminRoutes = require('./src/routes/admin.routes');
// // app.use('/admin', adminRoutes);

// // const userRoutes = require('./src/routes/user.routes');
// // app.use('/user', userRoutes);

// // const courseRoutes = require('./src/routes/course.routes');
// // app.use('/course', courseRoutes);

// // const cartRoutes = require('./src/routes/cart.routes');
// // app.use('/cart', cartRoutes);

// // const orderRoutes = require('./src/routes/order.routes');
// // app.use('/order', orderRoutes);

const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const facultyRoutes = require('./src/routes/faculty.routes');
app.use(facultyRoutes);

const contactRoutes = require('./src/routes/contact.routes');
app.use('/api/contact', contactRoutes);

const purchaseRoutes = require('./src/routes/purchase.routes');
const requireAuth = require('./src/middlewares/clerkAuth.middleware');

app.use('/api/purchase', requireAuth, purchaseRoutes);

const couponRoutes = require('./src/routes/coupon.routes');
app.use(couponRoutes);

const multer = require('multer');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Store files in the uploads directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const testimonialRoutes = require('./src/routes/testimonial.routes');
app.use('/api/testimonials', testimonialRoutes);

// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Connect to DB and start server
dbConnection().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB', err);
});