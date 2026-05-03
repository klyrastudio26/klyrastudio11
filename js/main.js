// Global Variables
let cart = [];
let products = [];
let collections = [];

const defaultProducts = [
    {
        name: 'Luminous Pearl Necklace',
        collection: 'Necklace',
        price: 2499,
        description: 'Beautiful pearl necklace with elegant design',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Golden Aura Ring',
        collection: 'Ring',
        price: 1799,
        description: 'Stunning golden ring for special occasions',
        image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Velvet Luxe Bracelet',
        collection: 'Bracelet',
        price: 2099,
        description: 'Premium bracelet with luxury finish',
        image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Radiant Solitaire Earrings',
        collection: 'Earrings',
        price: 1549,
        description: 'Exquisite earrings with sparkling stones',
        image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80'
    }
];

// Wait for db to be defined globally
async function waitForDB() {
  let attempts = 0;
  while (typeof db === 'undefined' && attempts < 100) {
    await new Promise(resolve => setTimeout(resolve, 50));
    attempts++;
  }
  
  if (typeof db === 'undefined') {
    console.error('❌ DB failed to load after 5 seconds');
    throw new Error('DB not loaded');
  }
  
  await db.initPromise;
  console.log('✓ DB ready');
}

// Debug function
function toggleDebug() {
    const panel = document.getElementById('debug-panel');
    const content = document.getElementById('debug-content');
    
    if (panel.style.display === 'none') {
        content.innerHTML = `
            <div><strong>IndexedDB Status</strong></div>
            <div>Products in memory: ${products.length} items</div>
            <div>Collections in memory: ${collections.length} items</div>
            <div>Cart items: ${cart.length} items</div>
            <div style="margin-top: 10px; font-size: 10px; color: #999;">IndexedDB has unlimited storage</div>
        `;
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

// Reload all data from localStorage
async function reloadAllData() {
    console.log('🔄 Manually reloading all data...');
    try {
        // Make sure db is ready
        await waitForDB();
        
        await loadProducts();
        console.log('✓ Products loaded:', products.length, 'products');
        displayProducts(products);
        console.log('✓ Products displayed');
        await loadCollections();
        console.log('✓ Collections loaded');
        alert('✓ Data refreshed! (' + products.length + ' products)');
    } catch (error) {
        console.error('❌ Error reloading data:', error);
        alert('❌ Error reloading data. Check console.');
    }
}

// Make sure it's globally accessible
window.reloadAllData = reloadAllData;

// ===== USER AUTHENTICATION =====
function updateAuthUI() {
    const userPhone = localStorage.getItem('user_phone');
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    console.log('🔐 Auth check - user_phone:', userPhone);
    
    if (userPhone) {
        // User is logged in
        console.log('✓ User logged in, hiding login button');
        if (loginBtn) {
            loginBtn.style.display = 'none';
            console.log('✓ Login button hidden');
        }
        if (userMenu) {
            userMenu.style.display = 'flex';
            console.log('✓ User menu shown');
        }
        if (document.getElementById('user-name-link')) {
            document.getElementById('user-name-link').textContent = '📦 My Orders';
        }
    } else {
        // User is NOT logged in
        console.log('✓ User NOT logged in, showing login button');
        if (loginBtn) {
            loginBtn.style.display = 'block';
            console.log('✓ Login button shown');
        }
        if (userMenu) {
            userMenu.style.display = 'none';
            console.log('✓ User menu hidden');
        }
    }
}

function logoutUser() {
    console.log('🚪 Logging out user...');
    localStorage.removeItem('user_phone');
    sessionStorage.removeItem('cart');
    localStorage.removeItem('cart');
    cart = [];
    updateAuthUI();
    window.location.href = '/klyrastudio/index.html';
}

window.updateAuthUI = updateAuthUI;
window.logoutUser = logoutUser;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== Page loaded - waiting for DB ===');
    
    try {
        // Wait for db to be ready
        await waitForDB();

        // Ensure any localStorage->IndexedDB migration has completed before loading products
        if (window.dbMigrationPromise) {
            console.log('Waiting for migration to complete...');
            await window.dbMigrationPromise;
            console.log('Migration completed before rendering products');
        }
        
        console.log('Loading data...');
        await loadProducts();
        await loadCollections();
        await loadCart();
        
        // Close mobile menu when a nav link is clicked
        document.querySelectorAll('#navLinks a').forEach(link => {
            link.addEventListener('click', () => {
                const navLinks = document.getElementById('navLinks');
                const menuToggle = document.getElementById('menuToggle');
                if (navLinks && menuToggle && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
        
        // Check if user is logged in
        updateAuthUI();
        
        console.log('✓ Initialization complete');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        document.getElementById('products-grid').innerHTML = '<div class="loading">Error initializing. Please refresh the page.</div>';
    }
});

// ===== PRODUCT FUNCTIONS ======
async function loadProducts() {
    try {
        console.log('📦 Loading products from Supabase (REQUIRED for all users to see)...');
        
        // CRITICAL: ALWAYS use Supabase for public product data
        // This ensures all users see the same products
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            console.error('❌ CRITICAL: Supabase not available! Products will not be visible to other users.');
            document.getElementById('products-grid').innerHTML = '<div class="loading" style="color: red;">⚠️ Database connection issue. Please refresh the page.</div>';
            return;
        }
        
        const { data, error } = await window.supabase.from('products').select('*');
        
        if (error) {
            console.error('❌ Supabase fetch error:', error);
            console.error('Error details:', error.message, error.code);
            document.getElementById('products-grid').innerHTML = '<div class="loading" style="color: red;">Error: ' + error.message + '</div>';
            return;
        }
        
        products = data.map(item => ({
            id: item.id,
            name: item.name,
            collection: item.collection,
            price: item.price,
            description: item.description,
            image: item.image || 'https://via.placeholder.com/280x250'
        }));
        
        console.log('✓ Loaded ' + products.length + ' products from Supabase:', products);
        console.log('✓ These products are NOW VISIBLE to ALL USERS across all devices');
        
        displayProducts(products);
    } catch (error) {
        console.error('❌ Error loading products:', error);
        document.getElementById('products-grid').innerHTML = '<div class="loading" style="color: red;">Error loading products: ' + error.message + '</div>';
    }
}

async function loadCollections() {
    try {
        // Only load from IndexedDB/localStorage to avoid Supabase schema errors
        const collections_data = JSON.parse(localStorage.getItem('collections') || '[]');
        collections = collections_data;
        let filterHTML = '';
        collections.forEach((collectionData) => {
            filterHTML += `<button class="filter-btn" onclick="filterProducts(event, '${collectionData.name}')">${collectionData.name}</button>`;
        });
        
        console.log('✓ Loaded collections:', collections);
        document.getElementById('collection-filters').innerHTML = filterHTML;
    } catch (error) {
        console.error('Error loading collections:', error);
    }
}

function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    console.log('displayProducts called with:', productsToShow);
    console.log('Number of products:', productsToShow.length);
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<div class="loading">No products available</div>';
        return;
    }

    const fallbackImage = 'https://via.placeholder.com/280x250/e8e8e8/999?text=No+Image';

    function normalizeProductImage(image) {
        if (!image) return fallbackImage;
        const value = String(image).trim();
        if (!value) return fallbackImage;
        if (/^(data:|https?:|\/\/)/i.test(value)) return value;
        if (value.startsWith('assets/') || value.startsWith('/')) return value;
        return `assets/${value}`;
    }

    grid.innerHTML = productsToShow.map(product => {
        const imageSrc = normalizeProductImage(product.image);
        return `
        <div class="product-card">
            <div class="product-image">
                <img src="${imageSrc}" alt="${product.name}" onerror="this.onerror=null;this.src='${fallbackImage}';">
            </div>
            <div class="product-info">
                <div class="product-collection">${product.collection || 'Collection'}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <p style="font-size: 12px; color: #666; margin-bottom: 15px;">${product.description || ''}</p>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
                    <button class="btn-secondary" onclick="viewProduct('${product.id}')">View</button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function filterProducts(event, collectionId) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else if (event && event.target) {
        event.target.classList.add('active');
    }

    if (collectionId === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.collection === collectionId);
        displayProducts(filtered);
    }
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
        }
    }
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
        document.querySelector('.modal-content .btn-primary').style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} each</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <strong>₹${item.price * item.quantity}</strong>
                </div>
            </div>
        `).join('');
        document.querySelector('.modal-content .btn-primary').style.display = 'block';
    }

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('tax').textContent = `₹${tax}`;
    document.getElementById('total').textContent = `₹${total}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) {
        displayCart();
    }
}

function saveCart() {
    localStorage.setItem('klyra_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('klyra_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    if (!navLinks || !menuToggle) return;

    navLinks.classList.toggle('open');
    if (navLinks.classList.contains('open')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// ===== CHECKOUT FUNCTIONS =====
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(total * 0.18);
    const finalTotal = total + tax;

    // Store order details in sessionStorage
    sessionStorage.setItem('checkout_data', JSON.stringify({
        items: cart,
        subtotal: total,
        tax: tax,
        total: finalTotal,
        timestamp: new Date().toISOString()
    }));

    // Redirect to checkout page
    window.location.href = 'pages/checkout.html';
}

// ===== UTILITY FUNCTIONS =====
function viewProduct(productId) {
    // Store product ID for viewing details
    sessionStorage.setItem('viewProductId', productId);
    window.location.href = 'pages/product-details.html';
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #d4af37;
        color: #1a1a1a;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ===== EXPOSE FUNCTIONS TO WINDOW (GLOBAL SCOPE) =====
// These must be after function declarations to avoid hoisting issues
window.toggleDebug = toggleDebug;
window.toggleCart = toggleCart;
window.toggleMobileMenu = toggleMobileMenu;
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.proceedToCheckout = proceedToCheckout;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide; // Function (not the variable)
window.reloadAllData = reloadAllData;
