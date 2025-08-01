# Martok - Watch Store E-commerce Website (MERN Stack)

A full-stack e-commerce application for selling watches and accessories, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### ✅ Completed Features

#### Backend Features
- **Authentication System**: JWT-based login/register with email verification
- **User Management**: Admin panel for user management with role-based access
- **Product Management**: Full CRUD operations with Cloudinary image upload
- **Order Management**: Complete order processing with status tracking
- **Payment Integration**: Razorpay payment gateway and WhatsApp order system
- **Address Management**: Multiple shipping addresses per user
- **Email System**: Automated emails for registration, password reset, and order confirmation
- **Security**: Rate limiting, CORS, helmet security headers

#### Database Models
- **User Model**: Authentication, roles, addresses, profile management
- **Product Model**: Complete product information with images, pricing, discounts
- **Order Model**: Order tracking, payment details, shipping information
- **Category Model**: Product categorization with layout settings
- **Coupon Model**: Discount codes with usage limits and expiry
- **Banner Model**: Homepage banners with responsive media
- **Settings Model**: Global app settings and payment method toggles

#### API Endpoints
- **Auth Routes**: `/api/auth` - Login, register, password reset, profile management
- **Product Routes**: `/api/products` - Product CRUD, search, filtering, reviews
- **User Routes**: `/api/users` - User management, address management
- **Order Routes**: `/api/orders` - Order creation, tracking, WhatsApp integration
- **Razorpay Routes**: `/api/razorpay` - Payment processing, verification

#### Frontend Setup
- **React App**: Modern React 18 with functional components and hooks
- **Redux Toolkit**: State management for auth, cart, products, orders
- **Tailwind CSS**: Mobile-first responsive design system
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client with interceptors for API calls

## 🛠 Tech Stack

- **Frontend**: React.js 18, Redux Toolkit, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Image Upload**: Cloudinary
- **Payment**: Razorpay (Test Mode)
- **Email**: Nodemailer with Gmail SMTP
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
martok-ecommerce/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── razorpayController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── Banner.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   └── razorpayRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── email.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Razorpay account (for payments)
- Gmail account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd martok-ecommerce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/martok

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dwuxkkig5
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_tYezeMpXGqYUAq
RAZORPAY_KEY_SECRET=t9s8LsBDd3I6bBwg8cj3xvPq

# Email Configuration
EMAIL_USER=mymartwithservice@gmail.com
EMAIL_PASS=oojdrmretzfvbfui

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=harshilbhuva7@gmail.com

# WhatsApp Configuration
WHATSAPP_NUMBER=+917046050558
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:8080

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on http://localhost:3000

## 📱 Key Features Implementation

### Authentication System
- JWT-based authentication with secure token handling
- Role-based access control (User/Admin)
- Password reset via email with secure token generation
- Automatic admin role assignment for configured email

### Payment Integration
- **Razorpay**: Complete payment flow with order creation and verification
- **WhatsApp Orders**: Automatic message generation with product images and order details
- Admin can toggle payment methods via settings

### Product Management
- Image upload to Cloudinary with automatic optimization
- Product search, filtering, and pagination
- Category-based product organization
- Review and rating system
- Stock management with automatic updates

### Order Management
- Complete order lifecycle tracking
- WhatsApp integration for order communication
- Email notifications for order updates
- Admin order management dashboard

### Mobile-First Design
- Responsive design optimized for mobile devices
- Mobile navigation and header layout
- Touch-friendly interface elements
- Optimized images for different screen sizes

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints
- `POST /api/orders/whatsapp` - Create WhatsApp order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Payment Endpoints
- `POST /api/razorpay/create-order` - Create Razorpay order
- `POST /api/razorpay/verify-payment` - Verify payment

## 🚧 Pending Features (Phase 2)

The following features are planned for Phase 2 implementation:

1. **Frontend Components**
   - Complete React components (Header, Footer, Product Cards, etc.)
   - Admin dashboard interface
   - Shopping cart functionality
   - Checkout process

2. **Advanced Features**
   - Category management (Admin)
   - Coupon system (Admin + Frontend)
   - Banner management
   - Global discount system
   - Advanced search and filtering

3. **UI/UX Enhancements**
   - Product image galleries
   - Loading states and animations
   - Error handling and validation
   - Mobile optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Contact

- **Admin Email**: harshilbhuva7@gmail.com
- **WhatsApp**: +91 7046050558
- **Support Email**: mymartwithservice@gmail.com

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB for the flexible database
- Cloudinary for image management
- Razorpay for payment processing
- Tailwind CSS for the utility-first CSS framework