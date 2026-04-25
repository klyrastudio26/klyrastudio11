const STORAGE_ORDERS_KEY = 'ks_orders';

const userLoginSection = document.getElementById('userLoginSection');
const userDashboardSection = document.getElementById('userDashboardSection');
const userLoginForm = document.getElementById('userLoginForm');
const userOrderTable = document.getElementById('userOrderTable');

let orders = [];

function loadOrders() {
  const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
  try {
    orders = saved ? JSON.parse(saved) : [];
  } catch {
    orders = [];
  }
}

function renderUserOrders(phone) {
  const userOrders = orders.filter(order => order.phone === phone);
  if (!userOrders.length) {
    userOrderTable.innerHTML = '<p class="hint">No orders found for this phone number.</p>';
    return;
  }

  const rows = userOrders
    .map((order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>₹${Number(order.total).toLocaleString()}</td>
        <td>${order.status}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
      </tr>
    `)
    .join('');

  userOrderTable.innerHTML = `
    <table class="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Name</th>
          <th>Total</th>
          <th>Status</th>
          <th>Submitted</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function handleUserLogin(event) {
  event.preventDefault();
  const phone = document.getElementById('userPhone').value.trim();

  if (!phone) {
    alert('Please enter your phone number.');
    return;
  }

  userLoginSection.hidden = true;
  userDashboardSection.hidden = false;
  renderUserOrders(phone);
}

function initUserEvents() {
  userLoginForm.addEventListener('submit', handleUserLogin);
}

function initUser() {
  loadOrders();
  initUserEvents();
}

initUser();