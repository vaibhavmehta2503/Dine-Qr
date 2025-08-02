# 🍽️ DIne - Digital Restaurant Management System

A comprehensive restaurant management platform that digitizes the dining experience with QR code menus, real-time order tracking, kitchen management, and AI-powered customer support.

## ✨ Features

### 🍽️ Customer Experience
- **QR Code Menu Access** - Scan QR codes to view restaurant menus instantly
- **Digital Menu Browsing** - Beautiful, responsive menu interface with categories and descriptions
- **Smart Cart Management** - Add items, adjust quantities, and view totals in real-time
- **Multiple Order Types** - Support for dine-in, takeaway, and delivery orders
- **Real-time Order Tracking** - Track order status from preparation to completion
- **Table Number Integration** - Automatic table assignment via QR codes

### 👨‍🍳 Kitchen Management
- **Real-time Order Dashboard** - Live view of all incoming orders
- **Order Status Updates** - Mark orders as preparing, ready, or completed
- **Priority Management** - Organize orders by status and time
- **Kitchen Staff Interface** - Intuitive dashboard for kitchen operations

### 🏪 Restaurant Management
- **Menu Management** - Add, edit, and manage menu items with categories
- **Inventory Tracking** - Monitor stock levels and set expiry alerts
- **Analytics Dashboard** - Sales reports, popular items, and performance metrics
- **Role-based Access** - Admin, staff, and customer role management
- **QR Code Generation** - Create unique QR codes for tables and locations

### 🤖 AI-Powered Features
- **Smart Chatbot** - AI-powered customer support using Google Gemini
- **Order Recommendations** - Personalized menu suggestions
- **Inventory Alerts** - Automated expiry notifications for inventory items

### 📱 Modern Technology Stack
- **Frontend**: React 19 with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk authentication system
- **AI Integration**: Google Gemini for chatbot functionality
- **Real-time Updates**: WebSocket-like polling for live data

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-DIne
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/dine
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   CLERK_SECRET_KEY=your_clerk_secret_key
   GOOGLE_API_KEY=your_google_gemini_api_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
project DIne/
├── src/                    # React frontend components
│   ├── CustomerMenu.jsx    # Customer menu interface
│   ├── KitchenDashboard.jsx # Kitchen management
│   ├── MenuSeller.jsx      # Menu management
│   ├── ChatBotWidget.jsx   # AI chatbot
│   ├── QRCodeGenerator.jsx # QR code generation
│   └── ...                 # Other components
├── backend/                # Node.js backend
│   ├── controllers/        # API controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & validation
│   └── utils/             # Utility functions
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🔧 API Endpoints

### Menu Management
- `GET /api/menu` - Get menu items
- `POST /api/menu` - Add new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Order Management
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Inventory Management
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory
- `DELETE /api/inventory/:id` - Remove inventory item

### Analytics
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/popular` - Popular items
- `GET /api/analytics/revenue` - Revenue reports

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile

## 🎯 Usage Guide

### For Customers
1. **Access Menu**: Scan QR code or visit the menu URL
2. **Browse Items**: View categories and item descriptions
3. **Add to Cart**: Select items and quantities
4. **Place Order**: Choose order type (dine-in/takeaway/delivery)
5. **Track Order**: Monitor real-time order status

### For Kitchen Staff
1. **Login**: Access kitchen dashboard with staff credentials
2. **View Orders**: See all pending and active orders
3. **Update Status**: Mark orders as preparing, ready, or completed
4. **Manage Priority**: Organize orders by urgency

### For Restaurant Managers
1. **Menu Management**: Add/edit menu items and categories
2. **Inventory Control**: Monitor stock levels and expiry dates
3. **Analytics**: View sales reports and performance metrics
4. **QR Management**: Generate QR codes for tables and locations
5. **Staff Management**: Manage user roles and permissions

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permissions for different user types
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin resource sharing security
- **Helmet.js** - Security headers and protection

## 🤖 AI Integration

The system integrates Google Gemini AI for:
- **Smart Chatbot**: Customer support and inquiries
- **Menu Recommendations**: Personalized suggestions
- **Order Processing**: Intelligent order handling

## 📊 Analytics & Reporting

- **Sales Analytics**: Daily, weekly, monthly sales reports
- **Popular Items**: Most ordered menu items
- **Revenue Tracking**: Income analysis and trends
- **Customer Insights**: Order patterns and preferences

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm test             # Run tests
```

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- React best practices and hooks

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Set production environment variables
NODE_ENV=production
# Deploy to your preferred hosting service (Heroku, Vercel, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Payment Integration**: Online payment processing
- **Loyalty Program**: Customer rewards and points system
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Voice Commands**: Voice-activated ordering system

---

**Built with ❤️ for modern restaurants**
