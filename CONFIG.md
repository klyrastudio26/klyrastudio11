# Configuration File - Customize Your Settings Here

## 📋 All Customizable Settings

### Business Information
```
Business Name: KLYRA STUDIO
Location: Chennai, India
Year: 2026
```

### Contact Information
```
Phone: 063811 63108  (Update in: index.html, README.md, config-sample.js)
WhatsApp: 063811 63108  (Update in: checkout.js, admin-dashboard.js)
UPI ID: keerthi8015-2@okaxis  (Update in: checkout.js, admin-dashboard.js)
Instagram: @klyrastudio  (Update in: index.html footer and contact section)
Email: For contact form
```

### Admin Credentials
```
Username: Klyrastudio11  (Update in: js/admin-auth.js)
Password: Klyrastudio@11  (Update in: js/admin-auth.js)

⚠️  IMPORTANT: Change these for production!
```

### Colors (Luxury Gold Theme)
```
Primary Gold: #d4af37  (Main accent color)
Light Gold: #e8c547  (Hover state)
Dark Background: #1a1a1a  (Dark luxury)
Light Background: #f5f5f5  (Page background)
Text Dark: #333  (Main text)
Text Light: #999  (Secondary text)
Danger Red: #e74c3c  (Error/delete buttons)
Success Green: #27ae60  (Confirmation)
```

### Firebase Configuration
```
Project Name: klyrastudio
Region: (Choose based on your location)

Collections to create in Firestore:
1. products
2. collections
3. orders
4. users

Structure is auto-handled by code
```

## 🔄 Where to Make Changes

### 1. Update Phone Number
Search for `063811 63108` in these files:
- `index.html` - Contact section
- `js/checkout.js` - CONTACT_WHATSAPP variable
- `js/admin-dashboard.js` - CONTACT_WHATSAPP variable
- `README.md` - Documentation

### 2. Update UPI ID
Search for `keerthi8015-2@okaxis` in these files:
- `pages/checkout.html` - Payment info display
- `js/checkout.js` - PAYMENT_UPI variable
- `js/admin-dashboard.js` - PAYMENT_UPI variable
- `README.md` - Documentation

### 3. Update Instagram Handle
Search for `@klyrastudio` in:
- `index.html` - Navigation and footer
- `README.md` - Contact section

### 4. Update Admin Credentials
Edit `js/admin-auth.js`:
```javascript
const ADMIN_USERNAME = 'Klyrastudio11';  // Change this
const ADMIN_PASSWORD = 'Klyrastudio@11';  // Change this
```

### 5. Update Colors
Edit `css/style.css` and replace:
- `#d4af37` with your primary color
- `#e8c547` with your hover color
- `#1a1a1a` with your dark background
- `#f5f5f5` with your light background

### 6. Update Business Name
Search for "KLYRA STUDIO" in:
- `index.html` - Logo and titles
- `pages/admin-login.html` - Admin panel title
- `pages/admin-dashboard.html` - Dashboard title
- `pages/user-login.html` - Login page

### 7. Update Firebase Config
Edit `js/config.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "klyrastudio.firebaseapp.com",
    projectId: "klyrastudio",
    storageBucket: "klyrastudio.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## 🎨 Color Scheme Reference

### Dark Luxury Theme (Current)
- Primary: Gold (#d4af37)
- Background: Dark (#1a1a1a)
- Accent: Light Gold (#e8c547)

### Alternative Themes

**Silver Luxury:**
- Primary: #c0c0c0 (Silver)
- Dark: #1a1a1a
- Accent: #e8e8e8

**Rose Gold:**
- Primary: #d4a5a5
- Dark: #1a1a1a
- Accent: #e8c8c8

**Diamond White:**
- Primary: #f0f0f0
- Dark: #000000
- Accent: #ffffff

## 📱 Responsive Breakpoints

Current breakpoints in CSS:
- Desktop: 1200px and above
- Tablet: 768px to 1199px
- Mobile: Below 768px

## 🔐 Security Checklist

Before going live:
- [ ] Change admin username and password
- [ ] Update Firebase config with your credentials
- [ ] Enable HTTPS (use Firebase Hosting)
- [ ] Set up proper password hashing (bcrypt)
- [ ] Enable Firestore security rules
- [ ] Update contact information
- [ ] Set up WhatsApp Business API
- [ ] Enable payment gateway (Razorpay)
- [ ] Test payment flow end-to-end

## 📊 Firestore Security Rules

Add these rules to Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public collections
    match /products/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    match /collections/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Private collections
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if false;
    }
    
    match /users/{document=**} {
      allow read: if request.auth.uid == resource.id;
      allow create: if true;
      allow update: if request.auth.uid == resource.id;
    }
  }
}
```

## 🎯 Feature Flags

### Enabled Features
- ✅ Product showcase
- ✅ Shopping cart
- ✅ User accounts
- ✅ Admin portal
- ✅ Payment verification
- ✅ Order management
- ✅ Product collections
- ✅ Responsive design

### Future Features (Can be enabled)
- ⏳ Razorpay payment integration
- ⏳ SMS notifications
- ⏳ Email notifications
- ⏳ Customer reviews
- ⏳ Wishlist
- ⏳ Advanced analytics
- ⏳ Bulk import

## 🚀 Deployment Checklist

- [ ] Firebase config updated
- [ ] Admin credentials changed
- [ ] Contact info updated
- [ ] Sample products added
- [ ] Business name updated
- [ ] Colors customized (if needed)
- [ ] Logo/images uploaded
- [ ] Security rules set
- [ ] Domain configured
- [ ] HTTPS enabled
- [ ] WhatsApp setup (optional)
- [ ] Email setup (optional)

## 📞 APIs Used

**Current:**
- Firebase Firestore - Database
- Firebase Storage - File storage
- Firebase Auth - Authentication

**Optional (Can add):**
- Razorpay - Payments
- Twilio - WhatsApp/SMS
- SendGrid - Email
- Google Sheets API - Data export

## 🎓 Learning Resources

- Firebase Docs: https://firebase.google.com/docs
- Web Development: https://developer.mozilla.org
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- CSS: https://developer.mozilla.org/en-US/docs/Web/CSS

---

**Version**: 1.0.0  
**Last Updated**: April 25, 2026

For detailed instructions, see README.md and QUICK_START.md
