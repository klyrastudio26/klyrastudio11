// ============ CONSTANTS ============
const ADMIN_EMAIL = 'klyrastudio11@gmail.com';
const ADMIN_PASSWORD = 'Klyrastudio@11';
const PRODUCTS_STORAGE_KEY = 'ks_products';
const ORDERS_STORAGE_KEY = 'ks_orders';
const SLIDESHOW_STORAGE_KEY = 'ks_slideshow';

// Default data
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

// ============ DOM ELEMENTS ============
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

// ============ STORAGE FUNCTIONS ============
function loadProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    products = saved ? JSON.parse(saved) : [...defaultProducts];
  } catch (e) {
    products = [...defaultProducts];
  }
}

function saveProducts() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function loadOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    orders = saved ? JSON.parse(saved) : [];
  } catch (e) {
    orders = [];
  }
}

function saveOrders() {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function loadSlideshow() {
  try {
    const saved = localStorage.getItem(SLIDESHOW_STORAGE_KEY);
    slideshow = saved ? JSON.parse(saved) : [...defaultSlideshow];
  } catch (e) {
    slideshow = [...defaultSlideshow];
  }
}

function saveSlideshow() {
  localStorage.setItem(SLIDESHOW_STORAGE_KEY, JSON.stringify(slideshow));
}

// ============ AUTHENTICATION ============
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername')?.value.trim();
  const password = document.getElementById('adminPassword')?.value.trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    if (logoutButton) logoutButton.hidden = false;
    
    renderProducts();
    renderOrders();
    renderSlideshow();
    switchTab('productsTab');
  } else {
    alert('❌ Invalid credentials!');
  }
}

function handleLogout() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  if (logoutButton) logoutButton.hidden = true;
  loginForm.reset();
}

// ============ PRODUCT FUNCTIONS ============
function handleProductSave(event) {
  event.preventDefault();

  const name = document.getElementById('productName')?.value.trim();
  const description = document.getElementById('productDescription')?.value.trim();
  const originalPrice = Number(document.getElementById('productPrice')?.value || 0);
  const discountPrice = Number(document.getElementById('discountPrice')?.value || originalPrice);
  const imageFile = document.getElementById('productImage')?.files[0];

  if (!name || !originalPrice || !imageFile) {
    alert('Please fill all fields!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    products.push({
      id: 'p' + Date.now(),
      name,
      description,
      originalPrice,
      discountPrice: Math.min(discountPrice, originalPrice),
      image: e.target.result,
    });
    saveProducts();
    productForm.reset();
    renderProducts();
    alert('✅ Product added!');
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

  if (!products || products.length === 0) {
    productTable.innerHTML = '<p class="hint">No products yet</p>';
    return;
  }

  let html = '<table class="admin-table"><thead><tr><th>Name</th><th>Original</th><th>Discount</th><th>Description</th><th>Action</th></tr></thead><tbody>';

  products.forEach(p => {
    html += `<tr>
      <td>${p.name}</td>
      <td>₹${p.originalPrice?.toLocaleString() || '0'}</td>
      <td>₹${p.discountPrice?.toLocaleString() || '0'}</td>
      <td>${(p.description || '').substring(0, 20)}...</td>
      <td><button class="button button-secondary" onclick="deleteProduct('${p.id}')">Delete</button></td>
    </tr>`;
  });

  html += '</tbody></table>';
  productTable.innerHTML = html;
}

// ============ ORDERS TAB - IMPROVED ============
function refreshOrders() {
  console.log('🔄 Refreshing Orders...');
  loadOrders(); // Reload from storage each time
  console.log('📋 Orders loaded:', orders.length, orders);
  renderOrders();
}

function renderOrders() {
  console.log('🎨 Rendering Orders...');
  if (!orderTable) {
    console.error('❌ orderTable element not found!');
    return;
  }

  console.log('📊 Orders to render:', orders.length);

  if (!orders || orders.length === 0) {
    orderTable.innerHTML = '<p class="hint">No orders yet. Waiting for customers...</p>';
    console.log('✅ Rendered empty orders message');
    return;
  }

  let html = '<table class="admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Address</th><th>Total</th><th>Items</th><th>Status</th><th>Action</th></tr></thead><tbody>';

  orders.forEach((order, idx) => {
    const itemCount = order.items?.length || 0;
    const status = order.verified ? '✅ VERIFIED' : '⏳ PENDING';
    const statusColor = order.verified ? 'green' : 'orange';
    
    html += `<tr>
      <td><strong>${order.name}</strong></td>
      <td>${order.phone}</td>
      <td>${order.address.substring(0, 30)}...</td>
      <td><strong>₹${order.total?.toLocaleString() || '0'}</strong></td>
      <td>${itemCount} items</td>
      <td style="color: ${statusColor}; font-weight: bold;">${status}</td>
      <td>${!order.verified ? `<button class="button button-secondary" onclick="verifyOrder(${idx})">✓ Verify</button>` : '<span style="color: green;">✓ Done</span>'}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  orderTable.innerHTML = html;
  console.log('✅ Orders rendered successfully');
}

function verifyOrder(idx) {
  if (orders[idx]) {
    orders[idx].verified = true;
    saveOrders();
    renderOrders();
    alert('✅ Order verified!');
  }
}

// ============ SLIDESHOW FUNCTIONS ============
function handleSlideshowSave(event) {
  event.preventDefault();

  const imageFile = document.getElementById('slideshowImage')?.files[0];

  if (!imageFile) {
    alert('Please select an image!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    slideshow.push(e.target.result);
    saveSlideshow();
    slideshowForm.reset();
    renderSlideshow();
    alert('✅ Slideshow image added!');
  };
  reader.readAsDataURL(imageFile);
}

function deleteSlideshow(idx) {
  if (confirm('Delete this image?')) {
    slideshow.splice(idx, 1);
    saveSlideshow();
    renderSlideshow();
  }
}

function renderSlideshow() {
  if (!slideshowTable) return;

  if (!slideshow || slideshow.length === 0) {
    slideshowTable.innerHTML = '<p class="hint">No slideshow images yet. Upload to display on homepage!</p>';
    return;
  }

  let html = '<table class="admin-table"><thead><tr><th>Image Preview</th><th>Size</th><th>Action</th></tr></thead><tbody>';

  slideshow.forEach((img, idx) => {
    const sizeKB = Math.round((img.length * 3/4) / 1024);
    html += `<tr>
      <td><img src="${img}" alt="Slide ${idx + 1}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid var(--accent);"></td>
      <td>${sizeKB} KB</td>
      <td><button class="button button-secondary" onclick="deleteSlideshow(${idx})">🗑️ Delete</button></td>
    </tr>`;
  });

  html += '</tbody></table>';
  slideshowTable.innerHTML = html;
}

// ============ TAB SWITCHING ============
function switchTab(tabName) {
  console.log(`📑 Switching to tab: ${tabName}`);
  
  document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

  const tab = document.getElementById(tabName);
  const btn = document.querySelector(`[data-tab="${tabName}"]`);
  
  console.log(`🔍 Found tab element: ${!!tab}, Found button: ${!!btn}`);
  
  if (tab) {
    tab.hidden = false;
    console.log(`✅ Tab "${tabName}" is now visible`);
  }
  if (btn) btn.classList.add('active');
  
  // Refresh data when switching to that tab
  if (tabName === 'ordersTab') {
    console.log('📦 Calling refreshOrders...');
    refreshOrders();
  } else if (tabName === 'slideshowTab') {
    console.log('🎬 Calling renderSlideshow...');
    renderSlideshow();
  } else if (tabName === 'productsTab') {
    console.log('📦 Calling renderProducts...');
    renderProducts();
  }
}

// ============ INITIALIZATION ============
function initAdmin() {
  console.log('🚀 Admin Portal Loading...');
  
  console.log('DOM Elements:');
  console.log('  orderTable:', orderTable);
  console.log('  productTable:', productTable);
  console.log('  slideshowTable:', slideshowTable);
  
  loadProducts();
  console.log('✅ Products loaded:', products.length);
  
  loadOrders();
  console.log('✅ Orders loaded:', orders.length);
  
  loadSlideshow();
  console.log('✅ Slideshow loaded:', slideshow.length);

  console.log('📊 Loaded:', {
    products: products.length,
    orders: orders.length,
    slideshow: slideshow.length
  });

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (logoutButton) logoutButton.addEventListener('click', handleLogout);
  if (logoutButtonDash) logoutButtonDash.addEventListener('click', handleLogout);
  if (productForm) productForm.addEventListener('submit', handleProductSave);
  if (slideshowForm) slideshowForm.addEventListener('submit', handleSlideshowSave);

  console.log('📌 Tab buttons found:', tabButtons.length);
  tabButtons.forEach((btn, idx) => {
    const tabName = btn.getAttribute('data-tab');
    console.log(`  Button ${idx}: "${tabName}"`);
    btn.addEventListener('click', () => switchTab(tabName));
  });

  console.log('✅ Admin Portal Ready!');
}

// Start when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
