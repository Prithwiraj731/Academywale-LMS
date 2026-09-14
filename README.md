# 🎓 Academywale LMS - Learning Management System

[![Live Website](https://img.shields.io/badge/Website-academywale.com-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://academywale.com)
[![Frontend Status](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Backend Status](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, high-performance Learning Management System (LMS) tailored for professional accounting students preparing for **CA (Chartered Accountancy)** and **CMA (Cost and Management Accountancy)** examinations across Foundation, Intermediate, and Final levels.

---

## 🌟 Overview & Architecture

Academywale LMS connects students with top educators across India, offering curated paper-wise and group-wise courses, secure admissions, instant enrollments, and intuitive administration controls.

```
                      ┌────────────────────────────────────────┐
                      │             User / Client              │
                      │          (Browser / Mobile)            │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │           Frontend (Vercel)            │
                      │      React 19 + Vite + Tailwind CSS    │
                      └──────────────────┬─────────────────────┘
                                         │  Proxy /api/ & /uploads/
                                         ▼
                      ┌────────────────────────────────────────┐
                      │          Backend API (Render)          │
                      │         Express.js / Node.js           │
                      └────────┬───────────┬─────────────┬─────┘
                               │           │             │
                 ┌─────────────┴┐   ┌──────┴──────┐   ┌──┴─────────────┐
                 ▼              ▼   ▼             ▼   ▼                ▼
          ┌─────────────┐ ┌───────────────┐ ┌──────────────┐ ┌─────────────────┐
          │  Supabase   │ │  Cloudinary   │ │   Razorpay   │ │  Resend / Brevo │
          │ (PostgreSQL)│ │(Media Storage)│ │  (Payments)  │ │ (Notifications) │
          └─────────────┘ └───────────────┘ └──────────────┘ └─────────────────┘
```

---

## 🚀 Key Features

### 📚 Academic Curriculum & Course Management
- **Hierarchical Examination Structure**: Full coverage of **CA** and **CMA** across Foundation, Intermediate, and Final streams.
- **Paper-Wise & Combo Courses**: Granular course catalog with faculty attribution, modes of delivery (Google Drive, Pen Drive, Live), and view limitations.
- **Top Faculty & Institute Directory**: Detailed instructor bios, experience records, paper specializations, demo lectures, and institutional partnerships.

### 💳 Checkout, Payments & Enrollments
- **Razorpay Payment Gateway**: Seamless credit/debit card, net banking, wallet, and UPI transactions.
- **Direct UPI Flow**: QR-code supported checkout with transaction ID capture and payment verification.
- **Dynamic Coupon System**: Configurable promotional discount codes with real-time validation and expiration controls.
- **Automated & Manual Enrollment**: Instant access assignment upon successful checkout, plus administrator overrides for offline admissions.

### 🛡️ Security & Administration
- **Role-Based Access Control (RBAC)**: Distinct permissions for Students, Instructors, and System Administrators.
- **Secure Authentication**: JWT-driven sessions, secure HTTP-only cookies, and Admin OTP verification via SMS/Email.
- **Comprehensive Admin Panel**:
  - Course creation, modification, and pricing management.
  - Faculty directory and institute partner management.
  - Testimonial curation and approval workflow.
  - User and enrollment oversight with exportable transaction logs.

---

## 💻 Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite | Fast Single Page Application (SPA) architecture |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Framer Motion | Modern, responsive mobile-first interface with micro-interactions |
| **Backend** | Node.js, Express.js | Modular RESTful API architecture with CORS preflight handling |
| **Database** | Supabase (PostgreSQL) | Managed relational database via `@supabase/supabase-js` |
| **File Storage** | Cloudinary | High-availability cloud CDN for images, banners, and course assets |
| **Payments** | Razorpay SDK & UPI | Secure online transaction lifecycle |
| **Communications** | Resend, Brevo, Nodemailer, Fast2SMS | Transactional receipts, password recovery, and admin OTP delivery |
| **Hosting** | Vercel (Client) + Render (Server) | Global Edge CDN frontend with containerized backend services |

---

## 📁 Repository Structure

```
Academywale-LMS/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets, logos, and ads.txt
│   ├── src/
│   │   ├── components/         # Reusable UI, layout, and admin components
│   │   ├── context/            # Authentication and application state providers
│   │   ├── pages/              # Route views (Home, CourseDetail, AdminDashboard, etc.)
│   │   ├── utils/              # Client-side helper functions & Razorpay checkout
│   │   ├── api.js              # Centralized API client & interceptors
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # React root mount
│   ├── vercel.json             # Vercel deployment rewrites & proxies
│   └── package.json            # Client dependencies
│
├── server/                     # Backend REST API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Supabase, Cloudinary, Razorpay, & Email configs
│   │   ├── controllers/        # Business logic for courses, users, auth, purchases
│   │   ├── middlewares/        # JWT auth, admin guard, and validation middlewares
│   │   ├── routes/             # Modular route endpoints
│   │   └── utils/              # Email templates, SMS dispatchers, and helpers
│   ├── app.js                  # Express application configuration & route binding
│   └── package.json            # Server dependencies
│
├── render.yaml                 # Infrastructure configuration for Render deployment
└── README.md                   # Project documentation
```

---

## 🛠️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase](https://supabase.com/) project account
- [Cloudinary](https://cloudinary.com/) account (for image uploads)
- [Razorpay](https://razorpay.com/) test account (for payment testing)

### 1. Clone the Repository
```bash
git clone https://github.com/Prithwiraj731/Academywale-LMS.git
cd Academywale-LMS
```

### 2. Configure Backend (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=90d

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Payments
RAZORPAY_KEY_ID=rzp_test_xxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email & SMS Delivery (Optional for local dev)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=support@academywale.com
EMAIL_PASS=your_email_password
ADMIN_EMAILS=admin@academywale.com
```

### 3. Configure Frontend (`client/.env`)
Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL_LOCAL=http://localhost:5000
VITE_API_URL=http://localhost:5000
VITE_PRIMARY_API_URL=http://localhost:5000

# Razorpay Test Key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxx
```

### 4. Install Dependencies & Launch

```bash
# In terminal 1: Start Backend Server
cd server
npm install
npm run dev

# In terminal 2: Start Frontend Development Server
cd client
npm install
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend Health Check**: `http://localhost:5000/health`

---

## 🚢 Deployment Guide

### Frontend Deployment on Vercel
1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Set the **Root Directory** to `client`.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. In **Project Settings > Environment Variables**, add:
   - `VITE_API_URL`: Your live Render backend URL (`https://<your-backend>.onrender.com`)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   *(Ensure public variables are saved with Type `Config`).*
5. The included `client/vercel.json` automatically proxies `/api/*` and `/uploads/*` requests to the Render backend to prevent cross-origin issues.

### Backend Deployment on Render
1. Create a new **Web Service** on [Render](https://render.com) connected to your repository.
2. Configure the service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Environment**: Node
3. Add all required environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `CLOUDINARY_*`, `RAZORPAY_*`) under **Environment Variables**.
4. Set health check path to `/health`.

---

## 🔒 Security & Best Practices
- **CORS Whitelisting**: Strict origin verification for production (`academywale.com`) and local development environments.
- **HTTP-Only Cookies**: Protected authentication states stored securely to prevent XSS credential leakage.
- **Transactional Verification**: Payment callback integrity verified server-side with Razorpay signature hashing before order fulfillment.

---

## 🤝 Contributing

Contributions are welcome to make Academywale LMS even better!
1. Fork the Project
2. Create a Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m "Add NewFeature"`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License & Contact

Distributed under the **MIT License**. See `LICENSE` for more information.

- **Website**: [academywale.com](https://academywale.com)
- **Support Email**: [support@academywale.com](mailto:support@academywale.com)
