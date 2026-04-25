// Global Variables
let currentSlide = 1;
let cart = [];
let products = [];
let collections = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCollections();
    loadCart();
    showSlide(currentSlide);
    autoSlide();
});

// ===== SLIDESHOW FUNCTIONS =====
function changeSlide(n) {
    showSlide(currentSlide += n);
}

function currentSlide(n) {
    showSlide(currentSlide = n);
}

function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
        currentSlide = 1;
    }
    if (n < 1) {
        currentSlide = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('fade');
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    slides[currentSlide - 1].classList.add('fade');
    dots[currentSlide - 1].classList.add('active');
}

function autoSlide() {
    setInterval(() => {
        showSlide(++currentSlide);
        if (currentSlide > document.getElementsByClassName('slide').length) {
            currentSlide = 1;
        }
    }, 5000);
}

// ===== PRODUCT FUNCTIONS =====
async function loadProducts() {
    try {
        const querySnapshot = await db.collection('products').get();
        products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = '<div class="loading">Error loading products. Please check Firebase configuration.</div>';
    }
}

async function loadCollections() {
    try {
        const querySnapshot = await db.collection('collections').get();
        collections = [];
        let filterHTML = '';
        querySnapshot.forEach((doc) => {
            collections.push({
                id: doc.id,
                ...doc.data()
            });
            filterHTML += `<button class="filter-btn" onclick="filterProducts('${doc.id}')">${doc.data().name}</button>`;
        });
        document.getElementById('collection-filters').innerHTML = filterHTML;
    } catch (error) {
        console.error('Error loading collections:', error);
    }
}

function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    if (productsToShow.length === 0) {
        grid.innerHTML = '<div class="loading">No products available</div>';
        return;
    }

    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || 'https://via.placeholder.com/280x250/e8e8e8/999?text=No+Image'}" alt="${product.name}">
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
    `).join('');
}

function filterProducts(collectionId) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

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
