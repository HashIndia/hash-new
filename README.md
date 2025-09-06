# 🛍️ Hash - Modern E-commerce Platform

<div align="center">
  <img src="./frontend/public/hash-logo-text.jpg" alt="Hash Logo" width="200" height="auto">
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://mongodb.com/)
</div>

## 🌟 Overview

**Hash** is a modern, full-stack e-commerce platform built with cutting-edge technologies. It features a responsive customer-facing storefront, a comprehensive admin dashboard, and a robust REST API backend with advanced authentication, payment processing, and inventory management.

### ✨ Key Features

- 🛒 **Modern Shopping Experience** - Responsive design with smooth animations
- 👨‍💼 **Admin Dashboard** - Complete store management interface
- 🔐 **Advanced Authentication** - JWT-based auth with refresh tokens
- 💳 **Payment Integration** - Razorpay payment gateway support
- 📱 **Cross-Platform** - Safari/iOS optimized authentication
- 🎨 **Beautiful UI** - Built with Tailwind CSS and Framer Motion
- 📊 **Analytics** - Real-time sales and customer insights
- 📧 **Email Integration** - Automated email notifications
- 🔍 **Search & Filter** - Advanced product search and filtering
- 📦 **Inventory Management** - Real-time stock tracking

## 🏗️ Architecture

The platform consists of three main components:

```
hash/
├── 🎨 frontend/          # Customer-facing React application
├── 👨‍💼 admin/             # Admin dashboard React application
└── 🔧 backend/           # Node.js REST API server
```

### Tech Stack

| Component | Technologies |
|-----------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Zustand |
| **Admin** | React 19, Vite, Tailwind CSS, Recharts, Zustand |
| **Backend** | Node.js, Express.js, MongoDB, JWT, Cloudinary |
| **Payment** | Razorpay Integration |
| **Deployment** | Vercel (Frontend/Admin), Render (Backend) |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 6+ (local or MongoDB Atlas)
- **Cloudinary** account for image storage
- **Email service** (Brevo/Sendinblue)
- **Razorpay** account for payments

### 1. Clone the Repository

```bash
git clone https://github.com/praveenyadav2005/Hash.git
cd Hash
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local
# Add: VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Admin Panel Setup

```bash
cd admin
npm install

# Create environment file
cp .env.example .env.local
# Add: VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The admin panel will start on `http://localhost:5174`

### 5. Create Admin User

```bash
cd backend
npm run create-admin
```

**Default admin credentials:**
- Email: `admin@hashstore.com`
- Password: `admin123`

## 🔧 Environment Variables

### Backend (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/hash-store

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters_long
ADMIN_JWT_SECRET=your_admin_jwt_secret_different_from_user_jwt
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
ADMIN_JWT_EXPIRES_IN=1h

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Brevo/Sendinblue)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=noreply@hashstore.com

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=4

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Admin (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

### Backend Structure

```
backend/
├── controllers/          # Route controllers
│   ├── authController.js      # User authentication
│   ├── adminController.js     # Admin operations
│   ├── productController.js   # Product management
│   ├── orderController.js     # Order processing
│   └── paymentController.js   # Payment handling
├── middleware/           # Custom middleware
│   ├── auth.js               # Authentication middleware
│   ├── adminAuth.js          # Admin authentication
│   └── errorHandler.js       # Error handling
├── models/              # MongoDB schemas
│   ├── User.js              # User model
│   ├── Admin.js             # Admin model
│   ├── Product.js           # Product model
│   └── Order.js             # Order model
├── routes/              # API routes
│   ├── authRoutes.js        # Auth endpoints
│   ├── productRoutes.js     # Product endpoints
│   └── admin/               # Admin-specific routes
├── services/            # Business logic
│   ├── emailService.js      # Email functionality
│   └── paymentService.js    # Payment processing
├── utils/               # Utility functions
└── server.js            # Application entry point
```

### Frontend Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   └── common/              # Common components
├── pages/               # Application pages
│   ├── Home.jsx             # Landing page
│   ├── Products.jsx         # Product catalog
│   ├── Login.jsx            # User authentication
│   └── Checkout.jsx         # Checkout process
├── services/            # API integration
├── stores/              # Zustand state management
├── lib/                 # Utility libraries
└── assets/              # Static assets
```

### Admin Structure

```
admin/src/
├── components/          # Admin UI components
├── pages/               # Admin pages
│   ├── Dashboard.jsx        # Analytics dashboard
│   ├── Products.jsx         # Product management
│   ├── Orders.jsx           # Order management
│   └── Customers.jsx        # Customer management
├── services/            # Admin API services
├── stores/              # Admin state management
└── lib/                 # Admin utilities
```

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh-token` | Refresh access token |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/search` | Search products |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Admin login |
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET | `/api/admin/products` | Manage products |
| GET | `/api/admin/orders` | Manage orders |
| GET | `/api/admin/customers` | Customer management |

## 🚀 Deployment

### Production Deployment

1. **Backend (Render)**
   - Connect GitHub repository
   - Set environment variables
   - Deploy with build command: `npm install`
   - Start command: `npm start`

2. **Frontend (Vercel)**
   - Import project from GitHub
   - Set build command: `npm run build`
   - Set environment variable: `VITE_API_URL`

3. **Admin (Vercel)**
   - Import admin folder from GitHub
   - Set build command: `npm run build`
   - Set environment variable: `VITE_API_URL`

### Environment Variables for Production

Update your production environment variables:

```env
# Backend (Render)
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
ADMIN_URL=https://your-admin.vercel.app

# Frontend (Vercel)
VITE_API_URL=https://your-backend.onrender.com/api

# Admin (Vercel)
VITE_API_URL=https://your-backend.onrender.com/api
```

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **HTTP-only Cookies** for token storage
- **Safari/iOS Compatible** authentication
- **Admin Role-based Access** control

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching
- **Smooth Animations** - Framer Motion integration
- **Loading States** - Enhanced user experience
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

## 📱 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full Support | Primary testing browser |
| Firefox | ✅ Full Support | Full compatibility |
| Safari Desktop | ✅ Full Support | Enhanced authentication |
| Safari iOS | ✅ Full Support | Safari-specific optimizations |
| Edge | ✅ Full Support | Full compatibility |

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Admin tests
cd admin
npm test
```

## 📝 Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm test           # Run tests
npm run create-admin # Create admin user
```

### Frontend/Admin Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```



## 👥 Team

- **Developer**: Praveen Yadav
- **GitHub**: [@praveenyadav2005](https://github.com/praveenyadav2005)

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check the [Issues](https://github.com/praveenyadav2005/Hash/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🔄 Changelog

### Version 1.0.0
- Initial release
- User authentication and registration
- Product catalog and search
- Shopping cart and checkout
- Admin dashboard
- Payment integration
- Safari/iOS authentication fixes

## 🚧 Roadmap

- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Advanced analytics
- [ ] Multi-vendor support
- [ ] Mobile app development
- [ ] API documentation with Swagger

---

<div align="center">
  <p>Made with ❤️ by Praveen</p>

</div>
