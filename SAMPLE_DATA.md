# Sample Data for Klyra Studio

## 📝 How to Add Sample Products

You can manually add these products through the Admin Portal, or if you have Firebase Admin SDK, use this data.

---

## 💎 Sample Collections

```json
{
  "collections": [
    {
      "name": "Engagement Rings",
      "description": "Exquisite diamond engagement rings for your special moment",
      "image": "https://via.placeholder.com/300x200/d4af37/1a1a1a?text=Engagement+Rings"
    },
    {
      "name": "Necklaces",
      "description": "Elegant necklaces with premium gemstones and metals",
      "image": "https://via.placeholder.com/300x200/d4af37/1a1a1a?text=Necklaces"
    },
    {
      "name": "Bracelets",
      "description": "Beautiful bracelets crafted with precision",
      "image": "https://via.placeholder.com/300x200/d4af37/1a1a1a?text=Bracelets"
    },
    {
      "name": "Earrings",
      "description": "Stunning earrings to complement any look",
      "image": "https://via.placeholder.com/300x200/d4af37/1a1a1a?text=Earrings"
    }
  ]
}
```

---

## 💍 Sample Products

### Engagement Rings Collection

```json
{
  "products": [
    {
      "name": "Classic Diamond Ring",
      "collection": "Engagement Rings",
      "price": 125000,
      "description": "A timeless classic with a stunning 1.5 carat diamond",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Diamond+Ring+1"
    },
    {
      "name": "Rose Gold Solitaire",
      "collection": "Engagement Rings",
      "price": 95000,
      "description": "Elegant rose gold ring with a perfect solitaire diamond",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Rose+Gold+Ring"
    },
    {
      "name": "Halo Diamond Ring",
      "collection": "Engagement Rings",
      "price": 150000,
      "description": "Modern halo design with brilliant diamonds",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Halo+Ring"
    },
    {
      "name": "Vintage Style Ring",
      "collection": "Engagement Rings",
      "price": 110000,
      "description": "Vintage inspired design with intricate detailing",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Vintage+Ring"
    }
  ]
}
```

### Necklaces Collection

```json
{
  "products": [
    {
      "name": "Diamond Pendant Necklace",
      "collection": "Necklaces",
      "price": 75000,
      "description": "Elegant pendant with brilliant cut diamond",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Diamond+Pendant"
    },
    {
      "name": "Pearl Chain Necklace",
      "collection": "Necklaces",
      "price": 55000,
      "description": "Classic pearl chain for everyday elegance",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Pearl+Chain"
    },
    {
      "name": "Gold Plated Necklace",
      "collection": "Necklaces",
      "price": 35000,
      "description": "Beautiful gold plated necklace with gemstone",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Gold+Necklace"
    }
  ]
}
```

### Bracelets Collection

```json
{
  "products": [
    {
      "name": "Diamond Tennis Bracelet",
      "collection": "Bracelets",
      "price": 85000,
      "description": "Classic tennis bracelet with continuous diamonds",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Tennis+Bracelet"
    },
    {
      "name": "Gold Bangle Bracelet",
      "collection": "Bracelets",
      "price": 45000,
      "description": "Traditional gold bangle with elegant design",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Gold+Bangle"
    }
  ]
}
```

### Earrings Collection

```json
{
  "products": [
    {
      "name": "Diamond Stud Earrings",
      "collection": "Earrings",
      "price": 65000,
      "description": "Timeless diamond stud earrings",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Diamond+Studs"
    },
    {
      "name": "Pearl Drop Earrings",
      "collection": "Earrings",
      "price": 38000,
      "description": "Elegant pearl drop earrings",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Pearl+Earrings"
    },
    {
      "name": "Gold Chandelier Earrings",
      "collection": "Earrings",
      "price": 42000,
      "description": "Stunning chandelier style gold earrings",
      "image": "https://via.placeholder.com/280x250/e8e8e8/999?text=Chandelier+Earrings"
    }
  ]
}
```

---

## 📝 How to Add to Firebase

### Option 1: Through Admin Dashboard (Recommended)
1. Go to `pages/admin-dashboard.html`
2. Login with: `Klyrastudio11` / `Klyrastudio@11`
3. Click "Add Collection" under Collections tab
4. Enter collection details
5. Click "Add Product" under Products tab
6. Enter product details

### Option 2: Firebase Console
1. Go to https://console.firebase.google.com/
2. Open your Firestore Database
3. Create a new document in "collections" collection
4. Add the above data
5. Repeat for products in "products" collection

### Option 3: Import JSON
If you have Firebase Admin SDK installed:
```bash
# Using Firebase CLI
firebase firestore:bulk-import collections.json
```

---

## 💰 Price Guide

### Suggested Price Ranges (in INR)

**Engagement Rings:**
- Basic: 50,000 - 100,000
- Standard: 100,000 - 200,000
- Premium: 200,000+

**Necklaces:**
- Budget: 25,000 - 50,000
- Mid-range: 50,000 - 100,000
- Premium: 100,000+

**Bracelets:**
- Budget: 20,000 - 40,000
- Standard: 40,000 - 80,000
- Premium: 80,000+

**Earrings:**
- Budget: 15,000 - 35,000
- Standard: 35,000 - 70,000
- Premium: 70,000+

---

## 🖼️ Image Sources (Free/Paid)

### Free Placeholder Services
- Placeholder.com - `https://via.placeholder.com/280x250`
- Lorem Picsum - `https://picsum.photos/280/250`

### Free Stock Photos
- Unsplash - unsplash.com
- Pexels - pexels.com
- Pixabay - pixabay.com

### Paid Premium
- Shutterstock
- iStock
- Adobe Stock
- Getty Images

### Upload Your Own
- Firebase Storage
- Cloudinary (free tier available)
- Imgur (free image hosting)

---

## 📋 Product Information Template

When adding products, use this template:

```
Product Name: [Specific name, e.g., "Classic Diamond Ring"]
Collection: [Category from collections list]
Price: [in INR, e.g., 125000]
Description: [2-3 sentences about the product]
Image: [URL to jewelry image]
```

---

## 🎁 Special Offers (Optional)

You can add custom fields to products for special offers:

```json
{
  "name": "Product Name",
  "price": 50000,
  "originalPrice": 60000,  // For discounts
  "discount": "20%",
  "isNew": true,
  "isFeatured": true,
  "isOffer": true
}
```

---

## 📊 Data Entry Tips

1. **Product Names**: Be specific (e.g., "1.5 Carat Diamond Ring")
2. **Descriptions**: Highlight unique features and materials
3. **Prices**: Use round numbers that seem luxury-oriented
4. **Images**: Use high-quality photos (at least 280x250px)
5. **Collections**: Keep categories simple and organized
6. **Consistency**: Maintain consistent naming across products

---

## 🔄 Bulk Operations

To add multiple products quickly:

1. Create a JSON file with all products
2. Use Firebase Admin SDK or Firestore Bulk Import
3. Or manually add through admin dashboard

### JSON Format for Bulk Import:
```json
[
  {
    "name": "Product 1",
    "collection": "Category",
    "price": 50000,
    "description": "Description",
    "image": "url"
  },
  {
    "name": "Product 2",
    "collection": "Category",
    "price": 60000,
    "description": "Description",
    "image": "url"
  }
]
```

---

**Version**: 1.0.0  
**Created**: April 25, 2026

For more information, see README.md and CONFIG.md
