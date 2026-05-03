# GitHub Pages Setup Guide

## 🚀 Enable GitHub Pages

1. Go to: https://github.com/klyrastudio/klyrastudio/settings
2. Navigate to **Pages** section (left sidebar)
3. Under "Build and deployment":
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` and folder `/root`
   - Click **Save**
4. GitHub will rebuild the site in 1-2 minutes
5. Your site will be available at: **https://klyrastudio.github.io/klyrastudio/**

## ⚙️ Create Supabase Database Tables

Your products and orders are stored in Supabase. You need to create the tables:

### 1. Go to Supabase Dashboard
- URL: https://supabase.com/dashboard
- Select your project (klyrastudio)

### 2. Create "products" Table
Run this SQL in the SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    collection TEXT,
    price DECIMAL(10,2),
    description TEXT,
    image TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (they're public)
CREATE POLICY "Products are public" ON products
    FOR SELECT TO public
    USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products" ON products
    FOR INSERT TO authenticated
    WITH CHECK (true);
```

### 3. Create "orders" Table (Optional but recommended)
```sql
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    products JSONB,
    total_amount DECIMAL(10,2),
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read orders
CREATE POLICY "Orders are public" ON orders
    FOR SELECT TO public
    USING (true);
```

## ✅ Verify Setup

1. **Check Products Load**
   - Visit: https://klyrastudio.github.io/klyrastudio/
   - Should load without 404 error
   - Should show "Waiting for DB" in console (normal)

2. **Test Admin Upload**
   - Go to admin: https://klyrastudio.github.io/klyrastudio/pages/admin-dashboard.html
   - Username: `Klyrastudio11`
   - Password: `Klyrastudio@11`
   - Add a test product
   - Check console for "✓ Product inserted into Supabase"

3. **Test Cross-Device Visibility**
   - Open main page on different device/browser
   - The product you added should appear
   - All users should see the same products

## 🖼️ Storage Setup (Optional - for image uploads)

If you want to upload product images instead of using URLs:

1. In Supabase, go to **Storage**
2. Create a bucket named `products`
3. Make it **Public**
4. This allows automatic image uploads when adding products

## ⚠️ Troubleshooting

**404 Error**: 
- Make sure GitHub Pages is enabled (see step 1)
- Check that Source is set to `main` branch
- Wait 2-3 minutes after enabling

**Products not showing to other users**:
- Check browser console for Supabase errors
- Verify "products" table exists in Supabase
- Verify Row Level Security policies are set

**Products only showing locally**:
- This means Supabase isn't being used
- Check that Supabase credentials in index.html are correct
- Open browser console and look for Supabase errors

## 📱 Cart Button
The cart button is now visible next to the menu button on mobile devices. No setup needed!
