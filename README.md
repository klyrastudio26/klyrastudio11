# ✨ KlyraStudio Jewelry E-Commerce Platform

**Live Website:** https://klyrastudio11.github.io/klyrastudio/

A professional, luxury jewelry e-commerce platform built with pure HTML/CSS/JavaScript. No frameworks, no backend, fully deployable to GitHub Pages.

---

## 🎯 Features

### 🏪 **Customer Storefront** (index.html)
- ✅ Beautiful luxury jewelry showcase with gold/dark theme
- ✅ Product catalog with images, descriptions, prices
- ✅ Shopping cart (add/remove items, quantity control)
- ✅ Order form (name, phone, address)
- ✅ Payment details display (UPI + WhatsApp)
- ✅ Auto-advancing slideshow (5-second rotation)
- ✅ Manual slideshow controls (left/right arrows)
- ✅ Responsive design (works on mobile & desktop)
- ✅ Dropdown navigation menus

### 👨‍💼 **Admin Portal** (admin.html)
- ✅ Secure login (username: `Klyrastudio11` | password: `Klyrastudio@11`)
- ✅ **Products Tab:**
  - Add/delete products with original price, discount price, description
  - Image uploads (auto-converted to base64)
  - Automatic discount percentage calculation
- ✅ **Orders Tab:**
  - View all customer orders in real-time
  - See: customer name, phone, address, items count, total price
  - Verify payment status (admin approves after payment screenshot)
  - Orders sync automatically from homepage
- ✅ **Slideshow Tab:**
  - Upload images for homepage slideshow
  - Manage slideshow images
  - Images appear automatically on homepage

### 📱 **User Order Tracking** (user.html)
- ✅ Customers can login with phone number
- ✅ View their own orders and status
- ✅ Track verified/pending payment status

### 🔧 **Diagnostic Tools**
- ✅ **diagnostic.html** - Real-time data viewer and sync tester
- ✅ **TESTING_GUIDE.md** - Step-by-step testing instructions
- ✅ **TROUBLESHOOTING.md** - Detailed debugging and common issues

---

## 📂 Project Structure

```
klyrastudio/
├── index.html              (🏪 Customer Storefront)
├── admin.html              (👨‍💼 Admin Portal)
├── user.html               (📱 Order Tracking)
├── diagnostic.html         (🔧 Diagnostic Dashboard)
├── script.js               (Storefront JavaScript)
├── admin.js                (Admin JavaScript)
├── user.js                 (User Portal JavaScript)
├── styles.css              (All Styling)
├── README.md               (This file)
├── TESTING_GUIDE.md        (Quick start testing)
├── TROUBLESHOOTING.md      (Debug guide)
└── .gitignore
```

---

## 🚀 Quick Start

### 1️⃣ **Access the Website**
```
Storefront:  https://klyrastudio11.github.io/klyrastudio/
Admin:       https://klyrastudio11.github.io/klyrastudio/admin.html
Diagnostic:  https://klyrastudio11.github.io/klyrastudio/diagnostic.html
```

### 2️⃣ **Verify Data Sync**
1. Open: https://klyrastudio11.github.io/klyrastudio/diagnostic.html
2. Click **"🔄 Refresh Data"** - should show products/orders/slides counts
3. Click **"+ Add Test Order"** - creates a test order
4. Open admin in new tab
5. Login with `Klyrastudio11` / `Klyrastudio@11`
6. Go to **Orders** tab
7. **You should see the test order!** ✅

### 3️⃣ **Test Real Order Flow**
1. Go to homepage
2. Add products to cart
3. Fill order form and click "Submit Order"
4. See order ID and payment instructions
5. Go to admin → Orders tab
6. Order appears immediately ✅

### 4️⃣ **Upload Slideshow**
1. Go to admin → Slideshow tab
2. Click "Browse" and select an image
3. Click "Upload"
4. Go to homepage and refresh
5. Slideshow appears at top with your image ✅

---

## 💾 Data Storage

All data is stored **locally in the browser** using `localStorage`:

```
ks_products   → Product catalog
ks_orders     → Customer orders
ks_slideshow  → Slideshow images
```

⚠️ **Important:** localStorage is **domain-specific**. Make sure you always access via:
- ✅ `https://klyrastudio11.github.io/klyrastudio/`
- ❌ NOT `file:///C:/path/to/index.html`
- ❌ NOT `http://localhost:8000/`

---

## 👥 Admin Credentials

```
Username: Klyrastudio11
Password: Klyrastudio@11
```

---

## 💳 Payment Details

**For Customers:**
- UPI ID: `keerthi8015-2@okaxis`
- WhatsApp for screenshots: `+91 063811 63108`

**Payment Flow:**
1. Customer places order on homepage
2. Order appears in Admin → Orders tab
3. Customer pays via UPI and sends screenshot
4. Admin verifies payment and clicks "✓ Verify" button
5. Order status changes to ✅ VERIFIED
6. Customer can check status in User Portal

---

## 📊 Product Data Structure

Products stored with:
```javascript
{
  id: 'unique-id',
  name: 'Product Name',
  description: 'Description',
  originalPrice: 10000,        // Price before discount
  discountPrice: 7500,         // Price after discount
  image: 'data:image/...'      // Base64 encoded image
}
```

**Discount % calculated automatically:** `((original - discount) / original) * 100`

---

## 📋 Order Data Structure

Orders stored with:
```javascript
{
  id: 'KS-XXXXXX',             // Auto-generated order ID
  name: 'Customer Name',       // From order form
  phone: '9876543210',         // From order form
  address: 'Delivery Address', // From order form
  items: [                     // Items in cart
    { id, name, discountPrice, quantity },
    ...
  ],
  total: 25000,                // Total amount
  verified: false,             // Admin payment verification
  createdAt: '2024-01-01T...'  // Timestamp
}
```

---

## 🎬 Slideshow Data

Slideshow images stored as:
- Base64 encoded strings
- Stored as array in localStorage
- Auto-advance every 5 seconds on homepage
- Manual controls with left/right arrows

---

## 🛠️ Technology Stack

- **HTML5** - Page structure
- **CSS3** - Responsive design with CSS variables for theming
- **Vanilla JavaScript** - No frameworks, pure JavaScript
- **localStorage** - Client-side data persistence
- **GitHub Pages** - Free hosting and deployment

---

## 📱 Mobile Responsive

- ✅ Mobile-first responsive design
- ✅ Menu collapses on small screens
- ✅ Touch-friendly buttons and forms
- ✅ Optimized images for fast loading

---

## 🎨 Design Features

- **Color Scheme:**
  - Background: Dark (#08060b)
  - Accent: Gold (#d4b560)
  - Text: Cream (#f4ede9)
- **Typography:** System fonts for fast loading
- **Styling:** CSS variables for easy customization
- **Animations:** Smooth transitions and auto-advancing slideshow

---

## 🔒 Security Notes

- Admin credentials stored in code (suitable for small team only)
- No sensitive payment processing (manual via UPI)
- All data stored locally in browser (not synced to server)
- Base64 images means large files - keep images under 500KB

---

## 📖 Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing procedures
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Debug guide and common issues
- **[diagnostic.html](diagnostic.html)** - Interactive data viewer and test tool

---

## 🔄 Development & Deployment

### Local Development
```bash
# Clone repository
git clone https://github.com/klyrastudio11/klyrastudio.git

# Open in VS Code
code klyrastudio

# Use VS Code Live Server extension for local testing
# Or use Python: python -m http.server 8000
```

### Deployment to GitHub Pages
```bash
# Make changes to files
# Commit to git
git add .
git commit -m "Description of changes"

# Push to main branch
git push origin main

# Changes live in ~1 minute at:
# https://klyrastudio11.github.io/klyrastudio/
```

---

## ✅ Testing Checklist

### Homepage Testing
- [ ] Products load with images
- [ ] Add to cart works
- [ ] Cart displays correct totals
- [ ] Order form accepts input
- [ ] Submit order shows order ID
- [ ] Slideshow auto-advances
- [ ] Slideshow controls work (left/right arrows)

### Admin Testing
- [ ] Login works
- [ ] Can add products
- [ ] Can delete products
- [ ] Orders from homepage appear
- [ ] Can verify payment
- [ ] Order status updates
- [ ] Can upload slideshow images
- [ ] Uploaded images appear on homepage

### Data Sync Testing
- [ ] Add order → appears in admin immediately
- [ ] Upload slideshow → appears on homepage after refresh
- [ ] Add product → appears on homepage after refresh
- [ ] Delete product → disappears on homepage after refresh

---

## 📝 License

Created for KlyraStudio Jewelry. All rights reserved.

---

## 🤝 Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first
2. Test with [diagnostic.html](diagnostic.html)
3. Review [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. Check browser DevTools Console for errors

---

**Last Updated:** 2024

**Current Version:** Production Ready ✅

**Website:** https://klyrastudio11.github.io/klyrastudio/
