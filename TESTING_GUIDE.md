# KlyraStudio Complete Setup & Testing Guide

## 🚀 Quick Start

### 1. **View Diagnostic Dashboard** 
First, open this to verify all data is syncing correctly:
https://klyrastudio11.github.io/klyrastudio/diagnostic.html

- Check: Products loaded ✅
- Check: Orders appearing ✅  
- Check: Slideshow images saved ✅

---

## 📱 **CUSTOMER FLOW - Test Orders**

### Step 1: Place an Order on Homepage
1. Go to: https://klyrastudio11.github.io/klyrastudio/
2. **Hard Refresh (Ctrl+Shift+R)** to clear cache
3. Click "Add to Cart" on any product
4. Scroll to **"Place Your Order"** section
5. Fill in:
   - Full Name: Your Name
   - Phone: 9876543210
   - Delivery Address: Any address
6. Click **"Submit Order"**
7. See: ✅ Order ID: `KS-XXXXXX` with payment instructions
8. **Open Console (F12)** - See order saved message

---

## 🛠️ **ADMIN FLOW - Verify Orders**

### Step 2: Check Orders in Admin
1. Go to: https://klyrastudio11.github.io/klyrastudio/admin.html
2. **Hard Refresh (Ctrl+Shift+R)**
3. Login:
   - Username: `Klyrastudio11`
   - Password: `Klyrastudio@11`
4. Click **"Orders"** tab
5. See: Customer name, phone, address, total amount
6. Status: ⏳ **PENDING** (orange)

### Step 3: Verify Payment
1. Customer pays ₹XXXX to: `keerthi8015-2@okaxis` (UPI)
2. Customer sends screenshot to: `+91 063811 63108` (WhatsApp)
3. **You verify the screenshot** ✓
4. In Admin Orders tab, click **"✓ Verify"** button
5. See: ✅ "Order verified!" alert
6. Status changes to: ✅ **VERIFIED** (green)

---

## 🎬 **SLIDESHOW FLOW - Upload Images**

### Step 4: Upload Slideshow Images (Admin)
1. In Admin, click **"Slideshow"** tab
2. Click **"Browse"** under "Slideshow Image"
3. Select an image file (JPG, PNG, etc.)
4. Click **"Upload"**
5. See: ✅ "Slideshow image added!" alert
6. Image appears in table with preview

### Step 5: See Slideshow on Homepage
1. Go back to: https://klyrastudio11.github.io/klyrastudio/
2. **Refresh page (F5)**
3. At top, see slideshow
4. Images auto-advance every 5 seconds
5. Click left/right arrows to manually control

---

## 📦 **PRODUCTS FLOW - Add Products**

### Step 6: Add New Products (Admin)
1. In Admin, click **"Products"** tab
2. Fill in:
   - Product Name: "Diamond Ring"
   - Description: "Beautiful diamond ring"
   - Original Price: 10000
   - Discount Price: 7500
   - Product Image: Select file
3. Click **"Save Product"**
4. See: ✅ "Product added!" alert
5. Product appears in table

### Step 7: See Products on Homepage
1. Go back to homepage
2. **Refresh (F5)**
3. See new product in grid
4. Shows: Original price (strikethrough) + Discount price (gold)
5. Shows discount percentage badge

---

## 🔍 **DEBUGGING - If Something Doesn't Work**

### Issue: Orders not appearing in Admin

**Solution:**
1. Open Diagnostic: https://klyrastudio11.github.io/klyrastudio/diagnostic.html
2. In "Test Functions" section, click: **"+ Add Test Order"**
3. Go back to Admin → Orders tab
4. Should see test order appear
5. If it does: ✅ Data syncing works
6. If not: Click **"🗑️ Clear All Data"** then refresh all pages

### Issue: Slideshow not uploading

**Solution:**
1. Open Diagnostic page
2. Click **"+ Add Test Slide"**
3. Go to homepage
4. Refresh (F5)
5. Should see test slideshow image at top
6. If it appears: ✅ Slideshow working
7. If not: Clear cache (Ctrl+Shift+R) on all pages

### Issue: Products not showing

**Solution:**
1. Open Diagnostic page
2. Click **"+ Add Test Product"**
3. Go to homepage
4. Refresh (F5)
5. Should see test product in grid
6. If it appears: ✅ Products working
7. If not: Check Console (F12) for errors

---

## 💡 **How It All Works**

```
CUSTOMER HOMEPAGE
    ↓
 Place Order
    ↓
Saved to: localStorage "ks_orders"
    ↓
ADMIN PORTAL
    ↓
Orders Tab → Loads orders from localStorage
    ↓
Click "✓ Verify" → Sets verified: true
    ↓
Status changes to: ✅ VERIFIED
    ↓
CUSTOMER NOTIFIED (You must tell them manually via WhatsApp/SMS)
```

---

## ✅ **Final Checklist**

- [ ] Diagnostic page loads and shows data counts
- [ ] Can add test products
- [ ] Can add test orders  
- [ ] Can add test slideshow images
- [ ] Products appear on homepage with images and prices
- [ ] Slideshow images auto-advance on homepage
- [ ] Customer can place order from homepage
- [ ] Order appears in Admin Orders tab
- [ ] Admin can verify payment status
- [ ] Verified orders show ✅ VERIFIED status
- [ ] New slideshow images show on homepage after upload

---

## 📞 **Quick Reference**

**Admin Login:**
- URL: https://klyrastudio11.github.io/klyrastudio/admin.html
- Username: Klyrastudio11
- Password: Klyrastudio@11

**UPI Payment:**
- keerthi8015-2@okaxis

**WhatsApp for Screenshots:**
- +91 063811 63108

**Diagnostic Dashboard:**
- https://klyrastudio11.github.io/klyrastudio/diagnostic.html

---

**Everything is now ready! Test using the diagnostic page first, then test real flows.** 🎉
