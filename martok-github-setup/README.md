# 🕰️ Martok - Premium Watch E-commerce Store

A full-stack MERN application for selling premium watches with modern UI, secure payments, and comprehensive admin panel.

## 🌟 Features

### Phase 1 ✅ (Completed)
- **Authentication System**: JWT-based login/register with role management
- **Product Management**: CRUD operations with Cloudinary image upload
- **Shopping Cart**: Add/remove items with persistent storage
- **Payment Integration**: Razorpay and WhatsApp order methods
- **Admin Panel**: User, product, and payment method management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Email Service**: Welcome emails and password reset functionality

### Phase 2 ✅ (Completed)
- **Coupon System**: Admin creation and frontend application
- **Discount System**: Global and per-product discounts
- **Banner Management**: Homepage image/video banner uploads
- **WhatsApp Integration**: Complete order redirection with product images
- **Persistent Cart**: Cart and address persistence after login/logout
- **Enhanced Admin Panel**: Mobile-responsive admin interface

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Cloudinary** - Image/video storage
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 📁 Project Structure

```
martok-ecommerce/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── Banner.js
│   │   └── Settings.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   └── razorpayController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── razorpayRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── email.js
│   ├── package.json
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   ├── Footer.js
    │   │   ├── MobileNav.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── LoginPage.js
    │   │   ├── ProductsPage.js
    │   │   ├── CartPage.js
    │   │   └── admin/
    │   │       └── AdminDashboard.js
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── cartSlice.js
    │   │       ├── productSlice.js
    │   │       └── orderSlice.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── auth.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (test mode)
- Gmail account for email service

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/martok-ecommerce.git
cd martok-ecommerce
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**
Create `.env` file in backend directory:
```env
PORT=8080
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=your_admin_email
WHATSAPP_NUMBER=your_whatsapp_number
```

5. **Run the Application**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in new terminal):
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Database Models
- **User**: Authentication, roles, addresses
- **Product**: Details, images, pricing, reviews
- **Order**: Items, payment, status tracking
- **Category**: Product categorization
- **Coupon**: Discount codes and rules
- **Banner**: Homepage promotional content
- **Settings**: Global app configuration

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

#### Orders
- `POST /api/orders/whatsapp` - Create WhatsApp order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)

#### Payments
- `POST /api/razorpay/create-order` - Create Razorpay order
- `POST /api/razorpay/verify-payment` - Verify payment
- `POST /api/razorpay/webhook` - Payment webhook

## 🔐 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation and sanitization

## 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Custom mobile navigation
- Responsive admin panel
- Touch-friendly interface

## 🎨 UI/UX Features
- Modern and clean design
- Loading states and error handling
- Toast notifications
- Smooth animations
- Intuitive navigation
- Search functionality

## 🚀 Deployment
Ready for deployment on:
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas
- **Media**: Cloudinary CDN

## 📄 License
This project is licensed under the ISC License.

## 👨‍💻 Author
**Martok Store Team**

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support
For support, email support@martokstore.com or join our Discord community.

---
⭐ **Star this repository if you found it helpful!**