# KLYRA STUDIO - QUICK START GUIDE

## 🚀 Getting Started (5 Minutes)

### Step 1: Download & Open Project
1. The project is in: `c:\Users\kamal\Klyra\`
2. Open `index.html` in your web browser to see the website

### Step 2: Firebase Setup (10 Minutes)
1. Go to https://console.firebase.google.com/
2. Create a new project: `klyrastudio`
3. Copy your config from Project Settings → Web App
4. Edit `js/config.js` and paste your Firebase credentials

### Step 3: Test the Website
1. Open `index.html` in browser
2. Click "Add to Cart" to add products
3. Go through checkout
4. Try admin login: `Klyrastudio11` / `Klyrastudio@11`

## 📋 Key Files Explained

| File | Purpose |
|------|---------|
| `index.html` | Main website homepage |
| `pages/admin-dashboard.html` | Admin portal |
| `pages/admin-login.html` | Admin login |
| `js/config.js` | Firebase configuration |
| `css/style.css` | Website styling |

## 🎨 Customization Checklist

- [ ] Add your Firebase config to `js/config.js`
- [ ] Change admin credentials in `js/admin-auth.js`
- [ ] Update UPI ID: Search for `keerthi8015-2@okaxis` and replace
- [ ] Update WhatsApp: Search for `063811 63108` and replace
- [ ] Add your Instagram link in `index.html`
- [ ] Upload actual product images
- [ ] Customize colors (gold `#d4af37` to your preference)

## 🔑 Important Credentials

**Admin Portal:**
- Username: `Klyrastudio11`
- Password: `Klyrastudio@11`

**Payment UPI:** `keerthi8015-2@okaxis`
**WhatsApp:** `063811 63108`

## 📦 What You Get

✅ **Main Website** - Product showcase with slideshows  
✅ **Shopping Cart** - Add/remove products, manage quantities  
✅ **User Login/Signup** - Customer accounts  
✅ **Checkout System** - Payment and shipping details  
✅ **Admin Portal** - Complete management system  
✅ **Payment Verification** - Screenshot-based verification  
✅ **Orders Management** - Track all orders  
✅ **Google Sheets Export** - Download orders as CSV  

## 🌐 Deployment (Choose One)

### Firebase Hosting (Easiest)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify (Drag & Drop)
Go to netlify.com, drag folder, done!

### GitHub Pages
Push to GitHub, enable Pages in settings

## 🛠️ Adding Your First Product

1. Open Admin Dashboard (`pages/admin-dashboard.html`)
2. Login with credentials above
3. Go to "Products" tab
4. Click "Add Product"
5. Fill details and image URL
6. Click "Add Product"

## 🎁 Adding Collections

1. In Admin Dashboard, go to "Collections" tab
2. Click "Add Collection"
3. Enter collection name and image
4. Click "Add Collection"

## 💳 Payment Flow

1. Customer adds items to cart
2. Goes to checkout
3. Enters shipping details
4. Gets UPI ID: `keerthi8015-2@okaxis`
5. Makes payment and uploads screenshot
6. Admin verifies in payment verification tab
7. Customer gets WhatsApp confirmation

## 📞 Important Update Fields

Search and update these in your files:

```
OLD VALUE → NEW VALUE
keerthi8015-2@okaxis → YOUR_UPI_ID
063811 63108 → YOUR_WHATSAPP
Klyrastudio11 → YOUR_ADMIN_USERNAME
Klyrastudio@11 → YOUR_ADMIN_PASSWORD
@klyrastudio → @YOUR_INSTAGRAM
```

## 🚨 Common Issues

**Products not showing?**
- Add sample products in admin dashboard

**Admin login failed?**
- Check username/password are exactly: Klyrastudio11 / Klyrastudio@11
- Clear browser cache

**Firebase error?**
- Check config.js has correct credentials
- Create collections in Firebase

## 📱 Mobile Optimization

Website is fully responsive on:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1199px)
- ✅ Mobile (below 768px)

## 🔒 Security

- Admin login required for management
- User & Admin portals are separate
- Payment screenshots verified before confirmation
- Session tokens for admin access

## 📞 Support Features

- WhatsApp integration for notifications
- Phone number for customer contact
- Email field for communication
- Order tracking system

---

## ⏭️ Next Steps

1. **Setup Firebase** (10 mins)
2. **Customize Colors & Details** (5 mins)
3. **Add Sample Products** (10 mins)
4. **Deploy Website** (5-20 mins depending on platform)
5. **Share with Instagram** 🎉

## 📞 Contact Integration

Current contact info in website:
- Phone: 063811 63108
- Instagram: @klyrastudio
- UPI: keerthi8015-2@okaxis

All are customizable in respective files.

---

**Last Updated**: April 25, 2026  
**Version**: 1.0.0  
**Status**: Ready to Deploy ✅
