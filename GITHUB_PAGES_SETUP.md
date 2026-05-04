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

-- Allow anyone to insert products using the anon key
CREATE POLICY "Products are public insert" ON products
    FOR INSERT TO public
    WITH CHECK (true);

-- Allow anyone to update products using the anon key
CREATE POLICY "Products are public update" ON products
    FOR UPDATE TO public
    WITH CHECK (true);

-- Allow anyone to delete products using the anon key
CREATE POLICY "Products are public delete" ON products
    FOR DELETE TO public
    USING (true);
```

### 3. Create "collections" Table (Required for shared collections)
If you get "policy already exists" error, the table might already exist. Try this alternative:

**First, check if table exists:**
```sql
SELECT * FROM collections LIMIT 1;
```

**If table doesn't exist, create it:**
```sql
CREATE TABLE collections (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are public" ON collections
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Collections are public insert" ON collections
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Collections are public update" ON collections
    FOR UPDATE TO public
    WITH CHECK (true);

CREATE POLICY "Collections are public delete" ON collections
    FOR DELETE TO public
    USING (true);
```

**If table exists but policies are missing:**
```sql
-- Enable RLS if not already enabled
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Add missing policies (skip if they exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Collections are public') THEN
        CREATE POLICY "Collections are public" ON collections FOR SELECT TO public USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Authenticated users can insert collections') THEN
        CREATE POLICY "Authenticated users can insert collections" ON collections FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Authenticated users can update collections') THEN
        CREATE POLICY "Authenticated users can update collections" ON collections FOR UPDATE TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Authenticated users can delete collections') THEN
        CREATE POLICY "Authenticated users can delete collections" ON collections FOR DELETE TO authenticated USING (true);
    END IF;
END $$;
```

### 4. Create "orders" Table (Optional but recommended)
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
   - Email: `klyrastudio11@gmail.com`
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
