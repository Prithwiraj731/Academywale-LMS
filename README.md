# 🎓 Academywale LMS - Learning Management System

A comprehensive **MERN Stack** Learning Management System designed for **CA (Chartered Accountant)** and **CMA (Cost and Management Accountant)** courses, featuring faculty management, course enrollment, payment processing, and administrative dashboards.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://academywale-lms.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

## 🌟 Features

### 🎯 Core Features
- **Multi-Level Course Structure**: Foundation, Intermediate, and Final levels for both CA and CMA
- **Faculty Management**: Detailed faculty profiles with qualifications and course assignments
- **User Authentication**: Secure login/registration system with JWT tokens
- **Student Dashboard**: Personal course enrollment, progress tracking, and purchase history
- **Admin Panel**: Comprehensive administrative controls for course and user management
- **Payment Integration**: UPI payment gateway with QR code generation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Cloud Media Management**: Cloudinary integration for image and video storage

### 📚 Academic Features
- **Course Categorization**: Organized by CA/CMA levels (Foundation, Inter, Final)
- **Faculty Profiles**: Detailed instructor information with specializations
- **Institute Management**: Partner institute listings and details
- **Course Materials**: Rich media content support
- **Student Enrollment**: Streamlined course registration process
- **Certificate Management**: Digital certificate generation and verification

### 🎨 UI/UX Features
- **Modern Animations**: Framer Motion for smooth transitions
- **3D Elements**: Interactive 3D pins and visual effects
- **Particle Effects**: Dynamic background animations
- **Dark/Light Themes**: Responsive color schemes
- **Mobile Optimization**: Touch-friendly interface design

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **Material-UI** - Component library
- **Lucide React** - Icon library
- **GSAP** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Cloud media storage
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### Deployment & Tools
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Media CDN
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Project Structure

```
Academywale-LMS/
├── client/                     # React frontend application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── common/        # Shared components
│   │   │   ├── home/          # Homepage components
│   │   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   │   └── ui/            # UI library components
│   │   ├── pages/             # Route components
│   │   ├── context/           # React context providers
│   │   ├── data/              # Static data and configurations
│   │   ├── lib/               # Utility libraries
│   │   ├── utils/             # Helper functions
│   │   ├── assets/            # Images and static assets
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   └── vercel.json            # Vercel deployment config
├── server/                     # Node.js backend application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Business logic
│   │   ├── middlewares/       # Express middlewares
│   │   ├── model/             # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # External service integrations
│   │   └── utils/             # Backend utilities
│   ├── app.js                 # Express server setup
│   └── package.json           # Backend dependencies
├── .env.example               # Environment variables template
├── render.yaml                # Render deployment config
├── package.json               # Root dependencies
└── README.md                  # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary** account
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Prithwiraj731/Academywale-LMS.git
cd Academywale-LMS
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/academywale?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Authentication
JWT_SECRET=your_jwt_secret_key

# Clerk Authentication (optional)
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 3. Install Dependencies

#### Install root dependencies:
```bash
npm install
```

#### Install client dependencies:
```bash
cd client
npm install
cd ..
```

#### Install server dependencies:
```bash
cd server
npm install
cd ..
```

### 4. Database Setup
1. Create a MongoDB database
2. Update the `MONGO_URI` in your `.env` file
3. The application will create necessary collections automatically

### 5. Cloudinary Setup
1. Create a [Cloudinary](https://cloudinary.com/) account
2. Get your cloud name, API key, and API secret from the dashboard
3. Update the Cloudinary configuration in your `.env` file

### 6. Run the Application

#### Development Mode:
```bash
# Start the backend server
cd server
npm run dev
# or
npm start

# In a new terminal, start the frontend
cd client
npm run dev
```

#### Production Build:
```bash
# Build the client
npm run build

# Start the production server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:category/:subcategory/:paperId` - Get courses by paper
- `POST /api/courses` - Create new course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Faculty
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:slug` - Get faculty by slug
- `POST /api/faculty` - Add faculty (admin only)
- `PUT /api/faculty/:id` - Update faculty (admin only)
- `DELETE /api/faculty/:id` - Delete faculty (admin only)

### Purchases
- `POST /api/purchase` - Process course purchase
- `GET /api/purchase/user/:userId` - Get user purchases
- `GET /api/purchase/verify/:transactionId` - Verify payment

### Contact
- `POST /api/contact` - Send contact form email

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)

## 🎨 UI Components

### Layout Components
- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Site footer with links and information
- **Sidebar**: Admin panel sidebar navigation

### Common Components
- **Particles**: Dynamic background particle effects
- **WhatsAppButton**: Floating WhatsApp contact button
- **ModernTestimonial**: Testimonial carousel component

### UI Library
- **3D Pin**: Interactive 3D pin containers
- **Modern Testimonial**: Animated testimonial cards
- **Button**: Customizable button components
- **Modal**: Reusable modal dialogs

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage with course categories
- `/about` - About us page
- `/contact` - Contact form
- `/courses` - Course listings
- `/courses/all` - All available courses
- `/faculties` - Faculty directory
- `/faculties/:slug` - Individual faculty profile
- `/institutes` - Partner institutes
- `/privacy-policy` - Privacy policy

### Course Routes
- `/ca/foundation-papers` - CA Foundation courses
- `/ca/inter-papers` - CA Intermediate courses
- `/ca/final-papers` - CA Final courses
- `/cma/foundation-papers` - CMA Foundation courses
- `/cma/inter-papers` - CMA Intermediate courses
- `/cma/final-papers` - CMA Final courses

### Protected Routes
- `/login` - User authentication
- `/register` - User registration
- `/student-dashboard` - Student portal
- `/admin` - Admin login
- `/admin-dashboard` - Admin panel
- `/payment/:courseType/:courseId` - Payment processing

## 🔐 Authentication & Security

### JWT Authentication
- Secure token-based authentication
- Protected routes with middleware
- Token expiration handling
- Refresh token mechanism

### Password Security
- Bcrypt password hashing
- Salt rounds configuration
- Password strength validation

### CORS Configuration
- Whitelist allowed origins
- Credential support
- Preflight handling

## 💳 Payment Integration

### UPI Payment System
- QR code generation
- Real-time payment verification
- Transaction tracking
- Payment confirmation emails

### Features
- Multiple payment methods
- Secure transaction processing
- Payment history tracking
- Automated receipt generation

## 🎯 Admin Panel Features

### Dashboard
- User statistics
- Course enrollment metrics
- Revenue analytics
- Recent activity logs

### Course Management
- Add/Edit/Delete courses
- Bulk course operations
- Course visibility controls
- Media upload management

### User Management
- User account administration
- Role-based access control
- User activity monitoring
- Bulk user operations

### Faculty Management
- Faculty profile management
- Course assignments
- Qualification tracking
- Performance analytics

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String (student/admin),
  isVerified: Boolean,
  purchases: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model
```javascript
{
  title: String,
  description: String,
  category: String,
  subcategory: String,
  paperId: String,
  faculty: ObjectId,
  price: Number,
  duration: String,
  level: String,
  image: String,
  videos: [String],
  materials: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Faculty Model
```javascript
{
  name: String,
  slug: String,
  bio: String,
  qualifications: [String],
  specializations: [String],
  experience: Number,
  image: String,
  courses: [ObjectId],
  rating: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Backend Deployment (Render)
1. Connect your repository to Render
2. Configure service settings:
   - Environment: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Environment Variables Setup
Ensure all required environment variables are configured in your deployment platform:
- MongoDB connection string
- Cloudinary credentials
- JWT secret
- Email configuration
- Any third-party API keys

## 📈 Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Image optimization with Cloudinary
- Lazy loading for components
- Caching strategies
- Bundle size optimization

### Backend
- Database query optimization
- Caching with Redis (planned)
- Image compression
- API response compression
- Connection pooling

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run test
```

### Backend Testing
```bash
cd server
npm run test
```

### End-to-End Testing
```bash
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use ESLint configuration provided
- Follow React best practices
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design

## 📋 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure your frontend URL is in the CORS whitelist
- Check that credentials are properly configured

**Database Connection Issues**
- Verify MongoDB URI format
- Check network access settings in MongoDB Atlas
- Ensure IP whitelist includes your deployment servers

**Image Upload Problems**
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper MIME type handling

**Build Failures**
- Clear node_modules and reinstall dependencies
- Check for version compatibility issues
- Verify all environment variables are set

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: [support@academywale.com](mailto:support@academywale.com)
- Documentation: [docs.academywale.com](https://docs.academywale.com)

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the flexible database solution
- **Vercel** for seamless deployment
- **Cloudinary** for media management
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for beautiful animations

## 🎯 Future Roadmap

### Planned Features
- [ ] Real-time chat support
- [ ] Video conferencing integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode support
- [ ] AI-powered course recommendations
- [ ] Blockchain certificates
- [ ] Progressive Web App (PWA)
- [ ] Advanced search and filtering

### Technical Improvements
- [ ] GraphQL API implementation
- [ ] Microservices architecture
- [ ] Redis caching layer
- [ ] Automated testing coverage
- [ ] Performance monitoring
- [ ] Security enhancements
- [ ] API rate limiting
- [ ] Database sharding

---

**Built with ❤️ by the Academywale Team**

For more information, visit [academywale.com](https://academywale.com)