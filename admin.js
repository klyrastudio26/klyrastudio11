const ADMIN_USERNAME = 'Klyrastudio11';
const ADMIN_PASSWORD = 'Klyrastudio@11';
const STORAGE_PRODUCTS_KEY = 'ks_products';
const STORAGE_ORDERS_KEY = 'ks_orders';

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

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const logoutButton = document.getElementById('logoutButton');
const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const productTable = document.getElementById('productTable');
const orderTable = document.getElementById('orderTable');
const exportOrders = document.getElementById('exportOrders');
const copyOrders = document.getElementById('copyOrders');
const tabButtons = document.querySelectorAll('.tab-button');

let products = [];
let orders = [];

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

function loadOrders() {
  const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
  try {
    orders = saved ? JSON.parse(saved) : [];
  } catch {
    orders = [];
  }
}

function saveOrders() {
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
}

function generateProductId() {
  return `p${Date.now().toString().slice(-6)}`;
}

function renderProductTable() {
  if (!products.length) {
    productTable.innerHTML = '<p class="hint">No products found. Add your first product to start selling.</p>';
    return;
  }

  const rows = products
    .map((product) => `
      <tr>
        <td>${product.name}</td>
        <td>₹${Number(product.price).toLocaleString()}</td>
        <td>${product.category || 'Jewelry'}</td>
        <td>${product.image ? 'Yes' : 'No'}</td>
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
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderOrderTable() {
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
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    logoutButton.hidden = false;
    renderProductTable();
    renderOrderTable();
    setTab('productsTab');
    return;
  }

  alert('Invalid admin credentials. Please try again.');
}

function handleLogout() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  logoutButton.hidden = true;
  loginForm.reset();
}

function handleProductSave(event) {
  event.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = Number(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value.trim();
  const image = document.getElementById('productImage').value.trim();

  if (!name || price <= 0) {
    alert('Please enter a valid product name and price.');
    return;
  }

  products.unshift({
    id: generateProductId(),
    name,
    price,
    category,
    image,
  });
  saveProducts();
  renderProductTable();
  productForm.reset();
}

function handleVerifyOrder(index) {
  const order = orders[index];
  if (!order) return;
  if (order.status === 'Payment Verified - Order Placed') {
    alert('This order has already been verified.');
    return;
  }
  order.status = 'Payment Verified - Order Placed';
  saveOrders();
  renderOrderTable();
  alert(`Order ${order.id} marked as verified.`);
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
  exportOrders.addEventListener('click', exportOrdersToCSV);
  copyOrders.addEventListener('click', copyOrdersToClipboard);
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
  initAdminEvents();
}

initAdmin();
