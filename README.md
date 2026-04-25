# Klyra Studio - Jewelry E-Commerce Website

A professional, elegant, and modern luxury jewelry e-commerce platform with admin portal for managing products, collections, and orders.

## Features

### 🎨 Frontend Website
- **Professional Design**: Modern, elegant, luxury look with gold accents
- **Product Showcase**: Beautiful product gallery with filterable collections
- **Professional Slideshows**: High-quality image sliders with auto-play
- **Shopping Cart**: Persistent cart with quantity management
- **User Authentication**: Sign up and login system
- **Responsive Design**: Works perfectly on all devices

### 👨‍💼 Admin Portal
- **Product Management**: Add, edit, and delete products
- **Collection Management**: Create and organize product collections
- **Order Management**: View all orders with customer details
- **Payment Verification**: Verify customer payment screenshots
- **Export Orders**: Download orders as CSV/Excel
- **User Management**: View user details and order history
- **Dashboard**: Real-time statistics and recent orders

### 💳 Payment & Orders
- **UPI Payment**: Direct UPI payment support (keerthi8015-2@okaxis)
- **Payment Screenshot Verification**: Admin verifies payments before order confirmation
- **WhatsApp Integration**: Automatic WhatsApp notifications to customers
- **Google Sheets Export**: Orders automatically synced to Google Sheets
- **Order Tracking**: Customers can track their orders

### 🔒 Security
- **Admin Credentials**: 
  - Username: `Klyrastudio11`
  - Password: `Klyrastudio@11`
- **Secure Session Management**: Session tokens for admin access
- **Separate User & Admin Portals**: Clear separation prevents unauthorized access

## Project Structure

```
Klyra/
├── index.html                 # Main website homepage
├── css/
│   ├── style.css             # Main website styles
│   ├── auth.css              # Authentication pages styles
│   ├── admin.css             # Admin dashboard styles
│   └── checkout.css          # Checkout page styles
├── js/
│   ├── config.js             # Firebase configuration
│   ├── main.js               # Main website functionality
│   ├── user-auth.js          # User authentication
│   ├── admin-auth.js         # Admin authentication
│   ├── admin-dashboard.js    # Admin dashboard functionality
│   └── checkout.js           # Checkout & payment processing
├── pages/
│   ├── user-login.html       # User login page
│   ├── user-signup.html      # User signup page
│   ├── admin-login.html      # Admin login page
│   ├── admin-dashboard.html  # Admin portal
│   └── checkout.html         # Checkout page
└── assets/                   # Images and media files
```

## Setup Instructions

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named `klyrastudio`
3. Go to **Project Settings** → **Web App**
4. Copy your Firebase credentials
5. Open `js/config.js` and replace the `firebaseConfig` object:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "klyrastudio.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 2: Firebase Database Setup

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database** in production mode
3. Create these collections:
   - `products` - Store jewelry products
   - `collections` - Store product collections
   - `orders` - Store customer orders
   - `users` - Store user accounts

### Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Enable **Email/Password** authentication (optional for advanced setup)

### Step 4: Deploy Website

You have multiple deployment options:

#### Option A: Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project folder
firebase init hosting

# Deploy
firebase deploy
```

#### Option B: GitHub Pages
1. Create a GitHub repository
2. Push your files
3. Go to Settings → Pages
4. Set source to `main` branch
5. Your site will be available at `https://yourusername.github.io/Klyra`

#### Option C: Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your folder
3. Your site will be deployed instantly

#### Option D: Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your repository or upload folder
3. Click Deploy

### Step 5: Google Sheets Integration (Optional)

For automatic order export to Google Sheets:

1. Create a Google Sheet
2. Set up Google Sheets API
3. Modify `exportOrdersToSheets()` in `admin-dashboard.js`

Currently, the export is to CSV. To use Google Sheets API:

```javascript
// Add this to exportOrdersToSheets() function
// Use Google Sheets API to append order data
```

### Step 6: WhatsApp Integration (Optional)

For automatic WhatsApp notifications:

#### Option A: Twilio
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your WhatsApp Sandbox credentials
3. Update the `sendOrderWhatsApp()` function in `checkout.js`

#### Option B: WhatsApp Business API
1. Apply for WhatsApp Business Account
2. Get API credentials
3. Implement API calls in JavaScript

#### Option C: Manual WhatsApp Links (Current Implementation)
The site generates WhatsApp links that admin can click to send messages manually.

## Admin Portal Guide

### Accessing Admin Portal
1. Go to your website and find the **Admin Login** link
2. Username: `Klyrastudio11`
3. Password: `Klyrastudio@11`

### Dashboard
- View total orders, revenue, products, and users
- See recent orders at a glance

### Products Management
- **Add Product**: Click "Add Product" to add new jewelry items
  - Enter product name, collection, price, description
  - Upload image or paste image URL
- **Edit Product**: Click "Edit" to modify product details
- **Delete Product**: Click "Delete" to remove products

### Collections Management
- **Add Collection**: Create product categories (Rings, Necklaces, etc.)
- **Edit Collection**: Modify collection details
- **Delete Collection**: Remove collections

### Orders Management
- View all orders with customer details
- See order status and payment status
- **Export to Google Sheets**: Download all orders as CSV

### Payment Verification
- View pending payments
- Check payment screenshot from customer
- **Verify & Approve**: Confirm payment and send WhatsApp notification
- Order status changes to "Confirmed" after verification

### Users Management
- View all registered users
- See user order history and total spent
- Track customer engagement

## Website URLs

### Main Website
- **Home**: `/index.html`
- **Collections**: `index.html#collections`
- **About**: `index.html#about`
- **Contact**: `index.html#contact`

### User Pages
- **User Login**: `/pages/user-login.html`
- **User Signup**: `/pages/user-signup.html`
- **Checkout**: `/pages/checkout.html`

### Admin Pages
- **Admin Login**: `/pages/admin-login.html`
- **Admin Dashboard**: `/pages/admin-dashboard.html`

## Product Data Structure

### Products Collection
```javascript
{
    id: "auto-generated",
    name: "Diamond Ring",
    collection: "Engagement Rings",
    price: 50000,
    description: "Beautiful diamond engagement ring",
    image: "https://...",
    createdAt: "2026-04-25T10:30:00Z"
}
```

### Orders Collection
```javascript
{
    id: "KLY1234567890",
    items: [...],
    total: 50000,
    customerName: "John Doe",
    customerPhone: "9876543210",
    customerEmail: "john@email.com",
    shipping: {...},
    paymentScreenshot: "data:image/...",
    status: "pending|confirmed|shipped|delivered",
    paymentStatus: "pending|verified",
    createdAt: "2026-04-25T10:30:00Z"
}
```

## Customization Guide

### Change Colors
Edit `css/style.css` and replace gold color (`#d4af37`) with your preferred color:
```css
/* Change all instances of #d4af37 to your color */
color: #your_color;
background: #your_color;
```

### Change Business Details
Update these in relevant files:
- **Business Name**: Update "KLYRA STUDIO" text
- **UPI ID**: Change `PAYMENT_UPI = 'keerthi8015-2@okaxis'` in `js/checkout.js`
- **WhatsApp Number**: Change `CONTACT_WHATSAPP = '063811 63108'`
- **Admin Credentials**: Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `js/admin-auth.js`

### Add Instagram Integration
Update Instagram link in footer and navigation:
```html
<a href="https://instagram.com/your_handle" target="_blank">Follow on Instagram</a>
```

## Image Upload

### Product Images
1. Use placeholder URLs (https://via.placeholder.com/)
2. For real images, use:
   - External image hosting (Imgur, Cloudinary)
   - Firebase Storage
   - Your own server

### Slideshow Images
1. Edit `index.html` in hero section
2. Replace `src` URLs with actual image URLs
3. Each slide should have at least 1200x600px dimensions

## Performance Tips

1. **Optimize Images**: Use compressed JPG/WebP formats
2. **Lazy Loading**: Images load on demand
3. **Caching**: Browser caches products and cart data
4. **Mobile First**: Responsive design loads efficiently on all devices

## Security Considerations

1. **Password Hashing**: In production, use proper password hashing (bcrypt)
2. **HTTPS**: Always use HTTPS for payment processing
3. **Data Validation**: Validate all user inputs
4. **API Keys**: Store sensitive data in environment variables
5. **Admin Access**: Use strong admin credentials and change them regularly

## Troubleshooting

### Firebase Not Loading
- Check Firebase configuration in `config.js`
- Ensure project ID matches your Firebase project
- Check browser console for errors

### Products Not Showing
- Ensure Firestore database is initialized
- Add test products through admin portal
- Check browser's Network tab for API calls

### Payment Not Working
- Verify UPI ID is correct
- Check payment screenshot upload
- Ensure file size is under 5MB

### Admin Login Not Working
- Clear browser cache and cookies
- Check admin credentials in `admin-auth.js`
- Ensure localStorage is enabled

## API Documentation

### Adding Product via JavaScript
```javascript
await db.collection('products').add({
    name: "Product Name",
    collection: "Collection Name",
    price: 5000,
    description: "Description",
    image: "image_url",
    createdAt: new Date().toISOString()
});
```

### Creating Order
```javascript
await db.collection('orders').doc(orderId).set({
    items: cartItems,
    total: totalAmount,
    customerName: "Name",
    customerPhone: "Phone",
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date().toISOString()
});
```

## Support & Contact

For issues or questions:
- Check the troubleshooting section
- Review Firebase documentation
- Contact support via the website contact form

## License

This project is created for Klyra Studio. All rights reserved.

## Version

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Production Ready

---

## Future Enhancements

- [ ] Razorpay payment integration
- [ ] SMS notifications
- [ ] Order tracking system
- [ ] Customer reviews and ratings
- [ ] Wishlist feature
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Bulk product import
- [ ] Multi-currency support
- [ ] Search and filters
