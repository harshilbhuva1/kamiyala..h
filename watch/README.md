# Watch Store - Full Stack E-commerce Application

A modern, responsive e-commerce application for selling premium timepieces, built with Node.js/Express backend and vanilla JavaScript frontend.

## 🚀 Features

### Frontend
- **Modern Responsive Design**: Built with Bootstrap 5 for mobile-first design
- **Product Catalog**: Dynamic product display with filtering by category
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **User Authentication**: Login/Register functionality
- **Interactive UI**: Smooth animations, notifications, and modal dialogs
- **Search & Filter**: Find products by category, brand, or description

### Backend
- **RESTful API**: Complete CRUD operations for products, users, and orders
- **Express.js Server**: Fast and scalable Node.js backend
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error management
- **Sample Data**: Pre-loaded with watch products for immediate testing

## 📁 Project Structure

```
watch/
├── backend/
│   ├── routes/
│   │   ├── products.js
│   │   ├── users.js
│   │   └── orders.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   │   └── app.js
│   ├── images/
│   └── index.html
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd watch/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd watch/frontend
```

2. Open `index.html` in your browser or serve it using a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000
```

3. Access the application at `http://localhost:8000`

## 🎯 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Filter by category
- `GET /api/products/brand/:brand` - Filter by brand

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## 🎨 Frontend Features

### Product Display
- Responsive grid layout
- Product cards with hover effects
- Category badges and price tags
- Add to cart functionality
- Product filtering by category

### Shopping Cart
- Persistent cart storage (localStorage)
- Quantity management
- Real-time total calculation
- Checkout process
- Cart modal with item details

### User Interface
- Modern navigation bar
- Hero section with call-to-action
- Feature highlights section
- About and contact sections
- Responsive footer

## 🔧 Customization

### Adding New Products
1. Edit `backend/server.js` or `backend/routes/products.js`
2. Add product data to the `watchProducts` array
3. Include required fields: id, name, brand, price, category, image, description

### Styling
- Modify CSS in `frontend/index.html` or create separate CSS files
- Update Bootstrap classes for different styling
- Customize color scheme and typography

### Backend Configuration
- Update `PORT` in `backend/server.js` for different port
- Add environment variables in `.env` file
- Configure database connection (currently using in-memory data)

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install production dependencies
3. Use PM2 or similar process manager
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build optimized version
2. Deploy to static hosting (Netlify, Vercel, GitHub Pages)
3. Update API base URL for production

## 🧪 Testing

### Sample Data
The application comes with sample watch products:
- Classic Analog Watch ($299.99)
- Digital Sports Watch ($199.99)
- Luxury Chronograph ($899.99)
- Smart Watch Pro ($399.99)

### Test User
- Email: john@example.com
- Password: hashedpassword123

## 🔒 Security Considerations

- Implement proper password hashing (bcrypt)
- Add JWT token validation
- Use HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
- Set up CORS properly for production

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Happy coding! ⌚**