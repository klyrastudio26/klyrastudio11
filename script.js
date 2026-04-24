// ============ CONSTANTS ============
const PRODUCTS_STORAGE_KEY = 'ks_products';
const ORDERS_STORAGE_KEY = 'ks_orders';
const SLIDESHOW_STORAGE_KEY = 'ks_slideshow';

// Default products with new structure
const defaultProducts = [
  {
    id: 'p001',
    name: 'Luminous Pearl Necklace',
    description: 'Beautiful pearl necklace with elegant design',
    originalPrice: 3499,
    discountPrice: 2499,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p002',
    name: 'Golden Aura Ring',
    description: 'Stunning golden ring for special occasions',
    originalPrice: 2299,
    discountPrice: 1799,
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p003',
    name: 'Velvet Luxe Bracelet',
    description: 'Premium bracelet with luxury finish',
    originalPrice: 2899,
    discountPrice: 2099,
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p004',
    name: 'Radiant Solitaire Earrings',
    description: 'Exquisite earrings with sparkling stones',
    originalPrice: 2299,
    discountPrice: 1549,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
  },
];

const defaultSlideshow = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80',
];

// ============ STATE ============
let products = [];
let orders = [];
let slideshow = [];
let cart = [];
let currentSlide = 0;

// ============ DOM ELEMENTS ============
const productGrid = document.getElementById('productGrid');
const slideshowContainer = document.getElementById('slideshowContainer');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');

// ============ STORAGE FUNCTIONS ============
function loadProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    products = saved ? JSON.parse(saved) : [...defaultProducts];
    console.log('✅ Products loaded:', products.length);
  } catch (e) {
    console.error('Failed to load products:', e);
    products = [...defaultProducts];
  }
}

function saveProducts() {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    console.log('✅ Products saved');
  } catch (e) {
    console.error('Failed to save products:', e);
  }
}

function loadOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    orders = saved ? JSON.parse(saved) : [];
    console.log('✅ Orders loaded:', orders.length);
  } catch (e) {
    console.error('Failed to load orders:', e);
    orders = [];
  }
}

function saveOrders() {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    console.log('✅ Orders saved');
  } catch (e) {
    console.error('Failed to save orders:', e);
  }
}

function loadSlideshow() {
  try {
    const saved = localStorage.getItem(SLIDESHOW_STORAGE_KEY);
    slideshow = saved ? JSON.parse(saved) : [...defaultSlideshow];
    console.log('✅ Slideshow loaded:', slideshow.length);
  } catch (e) {
    console.error('Failed to load slideshow:', e);
    slideshow = [...defaultSlideshow];
  }
}

// ============ RENDER FUNCTIONS ============
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '';
  
  if (!products || products.length === 0) {
    productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">No products available</p>';
    return;
  }

  products.forEach(product => {
    if (!product.originalPrice || !product.discountPrice) return;
    
    const discountPercent = Math.round(
      ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
    );
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image" style="background-image: url('${product.image}')"></div>
      <h3>${product.name}</h3>
      <p class="product-description">${product.description || ''}</p>
      <div class="product-pricing">
        <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
        <span class="discount-price">₹${product.discountPrice.toLocaleString()}</span>
        <span class="discount-badge">-${discountPercent}%</span>
      </div>
      <button class="button button-primary" data-product-id="${product.id}">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
}

function renderSlideshow() {
  if (!slideshowContainer) return;
  slideshowContainer.innerHTML = '';
  
  if (!slideshow || slideshow.length === 0) {
    slideshowContainer.innerHTML = '<div class="slide" style="background: var(--surface);"></div>';
    return;
  }

  slideshow.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = `slide ${index === currentSlide ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${image}')`;
    slideshowContainer.appendChild(slide);
  });
}

function renderCart() {
  if (!cartItems) return;
  
  if (!cart || cart.length === 0) {
    cartItems.innerHTML = '<p>No items added yet.</p>';
    cartTotal.textContent = '₹0';
    return;
  }

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.discountPrice * item.quantity;
    total += itemTotal;

    const line = document.createElement('div');
    line.className = 'cart-item';
    line.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>
        ₹${itemTotal.toLocaleString()} 
        <button data-remove="${index}">Remove</button>
      </span>
    `;
    cartItems.appendChild(line);
  });

  cartTotal.textContent = `₹${total.toLocaleString()}`;
}

// ============ CART FUNCTIONS ============
function addProductToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    alert('Product not found');
    return;
  }

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      discountPrice: product.discountPrice,
      quantity: 1,
    });
  }
  
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// ============ SLIDESHOW FUNCTIONS ============
function changeSlide(direction) {
  if (!slideshow || slideshow.length === 0) return;
  currentSlide = (currentSlide + direction + slideshow.length) % slideshow.length;
  renderSlideshow();
}

// ============ CHECKOUT FUNCTION ============
function handleCheckout(event) {
  event.preventDefault();

  if (!cart || cart.length === 0) {
    showOrderMessage('Please add items to cart!', false);
    return;
  }

  const name = document.getElementById('customerName')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  const address = document.getElementById('customerAddress')?.value.trim();

  if (!name || !phone || !address) {
    showOrderMessage('Please fill all fields!', false);
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);

  const order = {
    id: `KS-${Date.now().toString().slice(-6)}`,
    name,
    phone,
    address,
    items: [...cart],
    total,
    verified: false,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  saveOrders();

  cart = [];
  renderCart();
  orderForm.reset();

  showOrderMessage(
    `✅ Order placed! ID: <strong>${order.id}</strong><br>Pay ₹${total.toLocaleString()} to <strong>keerthi8015-2@okaxis</strong><br>Send screenshot to <strong>+91 063811 63108</strong>`,
    true
  );
}

function showOrderMessage(message, success = true) {
  if (!orderMessage) return;
  orderMessage.innerHTML = `<p>${message}</p>`;
  orderMessage.style.borderColor = success ? '#a9d6a9' : '#d68a8a';
  orderMessage.style.color = success ? '#c6f5d3' : '#ffd6d6';
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
  if (productGrid) {
    productGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-product-id]');
      if (btn) addProductToCart(btn.dataset.productId);
    });
  }

  if (cartItems) {
    cartItems.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-remove]');
      if (btn) removeCartItem(Number(btn.dataset.remove));
    });
  }

  if (orderForm) {
    orderForm.addEventListener('submit', handleCheckout);
  }

  // Slideshow auto-advance
  setInterval(() => changeSlide(1), 5000);
}

// ============ INITIALIZATION ============
function init() {
  console.log('🚀 KlyraStudio Storefront Loading...');
  
  loadProducts();
  loadOrders();
  loadSlideshow();

  console.log('📊 Loaded:', {
    products: products.length,
    orders: orders.length,
    slideshow: slideshow.length
  });

  renderProducts();
  renderSlideshow();
  renderCart();
  setupEventListeners();
  
  // Slideshow auto-advance every 5 seconds
  setInterval(() => changeSlide(1), 5000);
  
  console.log('✅ Storefront Ready!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
