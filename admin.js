// Constants
const ADMIN_USERNAME = 'Klyrastudio11';
const ADMIN_PASSWORD = 'Klyrastudio@11';
const PRODUCTS_KEY = 'ks_products';
const ORDERS_KEY = 'ks_orders';
const SLIDESHOW_KEY = 'ks_slideshow';

// Default products
const defaultProducts = [
  {
    id: 'p001',
    name: 'Luminous Pearl Necklace',
    description: 'Beautiful pearl necklace with elegant design',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p002',
    name: 'Golden Aura Ring',
    description: 'Stunning golden ring for special occasions',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p003',
    name: 'Velvet Luxe Bracelet',
    description: 'Premium bracelet with luxury finish',
    price: 2099,
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80'
  }
];

// Default slideshow images
const defaultSlideshow = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80'
];

// Data arrays
let products = [];
let orders = [];
let slideshow = [];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const logoutButtonDash = document.getElementById('logoutButtonDash');
const productForm = document.getElementById('productForm');
const productTable = document.getElementById('productTable');
const slideshowForm = document.getElementById('slideshowForm');
const slideshowTable = document.getElementById('slideshowTable');
const orderTable = document.getElementById('orderTable');
const tabButtons = document.querySelectorAll('.tab-button');

// ============ LOAD & SAVE FUNCTIONS ============
function loadProducts() {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  products = saved ? JSON.parse(saved) : [...defaultProducts];
}

function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function loadOrders() {
  const saved = localStorage.getItem(ORDERS_KEY);
  orders = saved ? JSON.parse(saved) : [];
}

function saveOrders() {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function loadSlideshow() {
  const saved = localStorage.getItem(SLIDESHOW_KEY);
  slideshow = saved ? JSON.parse(saved) : [...defaultSlideshow];
}

function saveSlideshow() {
  localStorage.setItem(SLIDESHOW_KEY, JSON.stringify(slideshow));
}

// ============ LOGIN FUNCTIONS ============
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    renderProducts();
    renderOrders();
    renderSlideshow();
    switchTab('productsTab');
  } else {
    alert('❌ Invalid username or password!');
    loginForm.reset();
  }
}

function handleLogout() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  loginForm.reset();
  window.scrollTo(0, 0);
}

// ============ PRODUCT FUNCTIONS ============
function handleProductSave(event) {
  event.preventDefault();
  
  const name = document.getElementById('productName').value.trim();
  const description = document.getElementById('productDescription').value.trim();
  const originalPrice = Number(document.getElementById('productPrice').value);
  const discountPrice = Number(document.getElementById('discountPrice')?.value) || originalPrice;
  const imageFile = document.getElementById('productImage').files[0];

  if (!imageFile) {
    alert('Please select an image!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const product = {
      id: 'p' + Date.now(),
      name,
      description,
      originalPrice,
      discountPrice: Math.min(discountPrice, originalPrice),
      image: e.target.result
    };
    products.push(product);
    saveProducts();
    productForm.reset();
    renderProducts();
    alert('✅ Product added successfully!');
  };
  reader.readAsDataURL(imageFile);
}

function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderProducts();
  }
}

function renderProducts() {
  if (!productTable) return;
  
  if (products.length === 0) {
    productTable.innerHTML = '<p class="hint">No products yet. Add your first product!</p>';
    return;
  }

  let html = '<table class="admin-table"><thead><tr><th>Name</th><th>Original Price</th><th>Discount Price</th><th>Description</th><th>Action</th></tr></thead><tbody>';
  
  products.forEach(p => {
    html += `<tr>
      <td>${p.name}</td>
      <td>₹${p.originalPrice?.toLocaleString() || 'N/A'}</td>
      <td>₹${p.discountPrice?.toLocaleString() || 'N/A'}</td>
      <td>${(p.description || '').substring(0, 25)}...</td>
      <td><button class="button button-secondary" onclick="deleteProduct('${p.id}')">Delete</button></td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  productTable.innerHTML = html;
}

// ============ ORDER FUNCTIONS ============
function renderOrders() {
  if (!orderTable) return;
  
  if (orders.length === 0) {
    orderTable.innerHTML = '<p class="hint">No orders yet.</p>';
    return;
  }

  let html = '<table class="admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Address</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  
  orders.forEach((order, idx) => {
    const statusText = order.verified ? '✅ Verified' : '⏳ Pending';
    html += `<tr>
      <td>${order.name}</td>
      <td>${order.phone}</td>
      <td>${order.address.substring(0, 20)}...</td>
      <td>₹${order.total.toLocaleString()}</td>
      <td>${statusText}</td>
      <td>${!order.verified ? `<button class="button button-secondary" onclick="verifyOrder(${idx})">Verify</button>` : '<span>Verified</span>'}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  orderTable.innerHTML = html;
}

function verifyOrder(index) {
  if (orders[index]) {
    orders[index].verified = true;
    saveOrders();
    renderOrders();
    alert('✅ Order verified!');
  }
}

// ============ SLIDESHOW FUNCTIONS ============
function handleSlideshowSave(event) {
  event.preventDefault();
  
  const imageFile = document.getElementById('slideshowImage').files[0];
  
  if (!imageFile) {
    alert('Please select an image!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    slideshow.push(e.target.result);
    saveSlideshow();
    slideshowForm.reset();
    renderSlideshow();
    alert('✅ Slideshow image added!');
  };
  reader.readAsDataURL(imageFile);
}

function deleteSlideImage(index) {
  if (confirm('Delete this slideshow image?')) {
    slideshow.splice(index, 1);
    saveSlideshow();
    renderSlideshow();
  }
}

function renderSlideshow() {
  if (!slideshowTable) return;
  
  if (slideshow.length === 0) {
    slideshowTable.innerHTML = '<p class="hint">No slideshow images yet.</p>';
    return;
  }

  let html = '<table class="admin-table"><thead><tr><th>Preview</th><th>Action</th></tr></thead><tbody>';
  
  slideshow.forEach((img, idx) => {
    html += `<tr>
      <td><img src="${img}" alt="Slide" style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
      <td><button class="button button-secondary" onclick="deleteSlideImage(${idx})">Delete</button></td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  slideshowTable.innerHTML = html;
}

// ============ TAB SWITCHING ============
function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.hidden = true;
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(tabName).hidden = false;
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ============ EVENT LISTENERS ============
function initializeAdmin() {
  // Load data
  loadProducts();
  loadOrders();
  loadSlideshow();

  // Login event
  loginForm.addEventListener('submit', handleLogin);
  
  // Logout events
  logoutButton.addEventListener('click', handleLogout);
  if (logoutButtonDash) {
    logoutButtonDash.addEventListener('click', handleLogout);
  }

  // Product form
  productForm.addEventListener('submit', handleProductSave);

  // Slideshow form
  slideshowForm.addEventListener('submit', handleSlideshowSave);

  // Tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });
}

// Start the admin portal
document.addEventListener('DOMContentLoaded', initializeAdmin);
