const ADMIN_USERNAME = 'Klyrastudio11';
const ADMIN_PASSWORD = 'Klyrastudio@11';
const STORAGE_PRODUCTS_KEY = 'ks_products';
const STORAGE_ORDERS_KEY = 'ks_orders';
const STORAGE_SLIDESHOW_KEY = 'ks_slideshow';

const defaultProducts = [
  {
    id: 'p001',
    name: 'Luminous Pearl Necklace',
    category: 'Necklace',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p002',
    name: 'Golden Aura Ring',
    category: 'Ring',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p003',
    name: 'Velvet Luxe Bracelet',
    category: 'Bracelet',
    price: 2099,
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p004',
    name: 'Radiant Solitaire Earrings',
    category: 'Earrings',
    price: 1549,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
  },
];

const defaultSlideshow = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80',
];
const dashboardSection = document.getElementById('dashboardSection');
const logoutButton = document.getElementById('logoutButton');
const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const productTable = document.getElementById('productTable');
const orderTable = document.getElementById('orderTable');
const slideshowForm = document.getElementById('slideshowForm');
const slideshowTable = document.getElementById('slideshowTable');
const loginSection = document.getElementById('loginSection');
const tabButtons = document.querySelectorAll('.tab-button');

let products = [];
let orders = [];
let slideshowImages = [];

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
  try {
    products = saved ? JSON.parse(saved) : defaultProducts.slice();
  } catch {
    products = defaultProducts.slice();
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
}

function loadSlideshow() {
  const saved = localStorage.getItem(STORAGE_SLIDESHOW_KEY);
  try {
    slideshowImages = saved ? JSON.parse(saved) : defaultSlideshow.slice();
  } catch {
    slideshowImages = defaultSlideshow.slice();
  }
}

function saveSlideshow() {
  localStorage.setItem(STORAGE_SLIDESHOW_KEY, JSON.stringify(slideshowImages));
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderProductTable() {
  if (!productTable) return;
  if (!products.length) {
    productTable.innerHTML = '<p class="hint">No products found. Add your first product to start selling.</p>';
    return;
  }

  const rows = products
    .map((product, index) => `
      <tr>
        <td>${product.name}</td>
        <td>₹${Number(product.price).toLocaleString()}</td>
        <td>${product.category || 'Jewelry'}</td>
        <td>${product.image ? 'Yes' : 'No'}</td>
        <td>
          <button class="button button-secondary" data-edit-product="${index}">Edit</button>
          <button class="button button-secondary" data-delete-product="${index}">Delete</button>
        </td>
      </tr>
    `)
    .join('');

  productTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderSlideshowTable() {
  if (!slideshowTable) return;
  if (!slideshowImages.length) {
    slideshowTable.innerHTML = '<p class="hint">No slideshow images. Add your first image to start the slideshow.</p>';
    return;
  }

  const rows = slideshowImages
    .map((image, index) => `
      <tr>
        <td><img src="${image}" alt="Slide ${index + 1}" style="width: 100px; height: 60px; object-fit: cover;"></td>
        <td>${image}</td>
        <td>
          <button class="button button-secondary" data-delete-slide="${index}">Delete</button>
        </td>
      </tr>
    `)
    .join('');

  slideshowTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Preview</th>
          <th>URL</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderOrderTable() {
  if (!orderTable) return;
  if (!orders.length) {
    orderTable.innerHTML = '<p class="hint">No order requests yet. Orders will appear after customers submit checkout details.</p>';
    return;
  }

  const rows = orders
    .map((order, index) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.phone}</td>
        <td>₹${Number(order.total).toLocaleString()}</td>
        <td>${order.status}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td>
          <button class="button button-secondary" data-verify="${index}">Verify</button>
        </td>
      </tr>
    `)
    .join('');

  orderTable.innerHTML = `
    <table class="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Total</th>
          <th>Status</th>
          <th>Submitted</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function setTab(activeTab) {
  tabButtons.forEach((button) => {
    const tabName = button.dataset.tab;
    const panel = document.getElementById(tabName);
    if (tabName === activeTab) {
      button.classList.add('active');
      panel.classList.remove('hidden');
    } else {
      button.classList.remove('active');
      panel.classList.add('hidden');
    }
  });
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Hide login section
    loginSection.removeAttribute('hidden');
    loginSection.style.display = 'none';
    loginSection.classList.add('hidden');
    
    // Show dashboard section
    dashboardSection.removeAttribute('hidden');
    dashboardSection.style.display = 'block';
    dashboardSection.classList.remove('hidden');
    
    // Show logout button
    logoutButton.removeAttribute('hidden');
    logoutButton.style.display = 'block';
    
    // Clear and render all tables
    renderProductTable();
    renderOrderTable();
    renderSlideshowTable();
    setTab('productsTab');
    
    // Scroll to top to see dashboard
    window.scrollTo(0, 0);
    console.log('✅ Login successful - dashboard should be visible now');
    
    return;
  }

  alert('Invalid admin credentials. Please try again.');
}

function handleLogout() {
  // Show login section
  loginSection.removeAttribute('hidden');
  loginSection.style.display = 'block';
  loginSection.classList.remove('hidden');
  
  // Hide dashboard section
  dashboardSection.setAttribute('hidden', '');
  dashboardSection.style.display = 'none';
  dashboardSection.classList.add('hidden');
  
  // Hide logout button
  logoutButton.setAttribute('hidden', '');
  logoutButton.style.display = 'none';
  
  // Reset form
  loginForm.reset();
  
  // Scroll to top to see login form
  window.scrollTo(0, 0);
  console.log('✅ Logout successful - login form should be visible now');
}

async function handleSlideshowSave(event) {
  event.preventDefault();
  const fileInput = document.getElementById('slideshowImage');
  const urlInput = document.getElementById('slideshowImageUrl');
  let image = urlInput.value.trim();

  if (fileInput.files.length > 0) {
    try {
      image = await readFileAsDataURL(fileInput.files[0]);
    } catch (error) {
      alert('Error reading file: ' + error.message);
      return;
    }
  }

  if (!image) {
    alert('Please select a file or enter a URL.');
    return;
  }

  slideshowImages.push(image);
  saveSlideshow();
  renderSlideshowTable();
  slideshowForm.reset();
}

function handleDeleteProduct(index) {
  if (confirm('Are you sure you want to delete this product?')) {
    products.splice(index, 1);
    saveProducts();
    renderProductTable();
  }
}

function handleEditProduct(index) {
  const product = products[index];
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productImage').value = product.image;
  productForm.dataset.editIndex = index;
  productForm.querySelector('button').textContent = 'Update Product';
}

async function handleProductSave(event) {
  event.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = Number(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value.trim();
  const fileInput = document.getElementById('productImageFile');
  const urlInput = document.getElementById('productImage');
  let image = urlInput.value.trim();
  const editIndex = productForm.dataset.editIndex;

  if (fileInput.files.length > 0) {
    try {
      image = await readFileAsDataURL(fileInput.files[0]);
    } catch (error) {
      alert('Error reading file: ' + error.message);
      return;
    }
  }

  if (!name || price <= 0) {
    alert('Please enter a valid product name and price.');
    return;
  }

  if (editIndex !== undefined && editIndex !== '') {
    const idx = Number(editIndex);
    products[idx] = { ...products[idx], name, price, category, image };
    delete productForm.dataset.editIndex;
    productForm.querySelector('button').textContent = 'Save Product';
  } else {
    products.unshift({
      id: generateProductId(),
      name,
      price,
      category,
      image,
    });
  }
  saveProducts();
  renderProductTable();
  productForm.reset();
}

function handleDeleteSlide(index) {
  if (confirm('Are you sure you want to delete this slideshow image?')) {
    slideshowImages.splice(index, 1);
    saveSlideshow();
    renderSlideshowTable();
  }
}

function exportOrdersToCSV() {
  if (!orders.length) {
    alert('No orders available to export.');
    return;
  }

  const csvRows = [
    ['Order ID', 'Customer Name', 'Phone', 'Address', 'Total', 'Status', 'Submitted At', 'Items'],
  ];

  orders.forEach((order) => {
    const itemList = order.items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(' | ');
    csvRows.push([
      order.id,
      order.customerName,
      order.phone,
      order.address,
      order.total,
      order.status,
      order.createdAt,
      itemList,
    ]);
  });

  const csvContent = csvRows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'klyrastudio-orders.csv';
  link.click();
  URL.revokeObjectURL(url);
}

async function copyOrdersToClipboard() {
  if (!orders.length) {
    alert('No orders available to copy.');
    return;
  }

  const text = orders
    .map(
      (order) =>
        `Order ${order.id}: ${order.customerName} | ${order.phone} | ₹${order.total} | ${order.status} | Items: ${order.items
          .map((item) => `${item.name} x${item.quantity}`)
          .join(', ')}`,
    )
    .join('\n\n');

  try {
    await navigator.clipboard.writeText(text);
    alert('Order data copied to clipboard. Paste into Google Sheets or your preferred order system.');
  } catch (error) {
    alert('Copy failed. Please use export instead.');
  }
}

function initAdminEvents() {
  loginForm.addEventListener('submit', handleLogin);
  logoutButton.addEventListener('click', handleLogout);
  productForm.addEventListener('submit', handleProductSave);
  slideshowForm.addEventListener('submit', handleSlideshowSave);
  exportOrders.addEventListener('click', exportOrdersToCSV);
  copyOrders.addEventListener('click', copyOrdersToClipboard);
  productTable.addEventListener('click', (event) => {
    const editButton = event.target.closest('button[data-edit-product]');
    if (editButton) {
      handleEditProduct(Number(editButton.dataset.editProduct));
    }
    const deleteButton = event.target.closest('button[data-delete-product]');
    if (deleteButton) {
      handleDeleteProduct(Number(deleteButton.dataset.deleteProduct));
    }
  });
  slideshowTable.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('button[data-delete-slide]');
    if (deleteButton) {
      handleDeleteSlide(Number(deleteButton.dataset.deleteSlide));
    }
  });
  orderTable.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-verify]');
    if (!button) return;
    handleVerifyOrder(Number(button.dataset.verify));
  });
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => setTab(button.dataset.tab));
  });
}

function initAdmin() {
  loadProducts();
  loadOrders();
  loadSlideshow();
  
  // Ensure dashboard is hidden and login is visible on page load
  loginSection.removeAttribute('hidden');
  loginSection.style.display = 'block';
  loginSection.classList.remove('hidden');
  
  dashboardSection.setAttribute('hidden', '');
  dashboardSection.style.display = 'none';
  dashboardSection.classList.add('hidden');
  
  logoutButton.setAttribute('hidden', '');
  logoutButton.style.display = 'none';
  
  initAdminEvents();
}

initAdmin();
