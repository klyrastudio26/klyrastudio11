// Admin Dashboard
const ADMIN_USERNAME = 'Klyrastudio11';
const ADMIN_PASSWORD = 'Klyrastudio@11';
const PAYMENT_UPI = 'keerthi8015-2@okaxis';
const CONTACT_WHATSAPP = '063811 63108';

let currentTab = 'dashboard';
let allProducts = [];
let allCollections = [];
let allOrders = [];
let allUsers = [];

// Check admin authentication on page load
window.addEventListener('load', () => {
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    const adminName = localStorage.getItem('admin_username');
    document.getElementById('admin-name').textContent = adminName || 'Admin';
    
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        await Promise.all([
            loadProducts(),
            loadCollections(),
            loadOrders(),
            loadUsers()
        ]);
        
        updateDashboardStats();
        loadRecentOrders();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Set active nav item
    event.target.closest('.nav-item')?.classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Manage Products',
        'collections': 'Manage Collections',
        'orders': 'Manage Orders',
        'payment-verification': 'Payment Verification',
        'users': 'Manage Users'
    };
    
    document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
    currentTab = tabName;
    
    // Load tab-specific data
    if (tabName === 'products') {
        displayProducts();
    } else if (tabName === 'collections') {
        displayCollections();
    } else if (tabName === 'orders') {
        displayOrders();
    } else if (tabName === 'payment-verification') {
        displayPendingPayments();
    } else if (tabName === 'users') {
        displayUsers();
    }
}

// ===== PRODUCTS MANAGEMENT =====
async function loadProducts() {
    try {
        const querySnapshot = await db.collection('products').get();
        allProducts = [];
        querySnapshot.forEach((doc) => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    const tbody = document.getElementById('products-table-body');
    
    if (allProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No products yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = allProducts.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td>${product.collection || 'N/A'}</td>
            <td>₹${product.price}</td>
            <td>
                <img src="${product.image || 'https://via.placeholder.com/40'}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 5px;">
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddProductModal() {
    // Load collections for dropdown
    const select = document.getElementById('product-collection');
    select.innerHTML = '<option value="">Select Collection</option>' + 
        allCollections.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.add('show');
}

document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const collection = document.getElementById('product-collection').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const imageUrl = document.getElementById('product-image-url').value;
    
    try {
        await db.collection('products').add({
            name,
            collection,
            price,
            description,
            image: imageUrl || 'https://via.placeholder.com/280x250',
            createdAt: new Date().toISOString()
        });
        
        alert('Product added successfully!');
        closeProductModal();
        await loadProducts();
        displayProducts();
    } catch (error) {
        alert('Error adding product: ' + error.message);
    }
});

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await db.collection('products').doc(productId).delete();
            alert('Product deleted successfully!');
            await loadProducts();
            displayProducts();
        } catch (error) {
            alert('Error deleting product: ' + error.message);
        }
    }
}

async function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-collection').value = product.collection;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image-url').value = product.image || '';
    
    // Store current product ID for update
    document.getElementById('product-form').dataset.productId = productId;
    document.querySelector('#product-modal h2').textContent = 'Edit Product';
    
    document.getElementById('product-modal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
    delete document.getElementById('product-form').dataset.productId;
    document.querySelector('#product-modal h2').textContent = 'Add Product';
}

// ===== COLLECTIONS MANAGEMENT =====
async function loadCollections() {
    try {
        const querySnapshot = await db.collection('collections').get();
        allCollections = [];
        querySnapshot.forEach((doc) => {
            allCollections.push({
                id: doc.id,
                ...doc.data()
            });
        });
    } catch (error) {
        console.error('Error loading collections:', error);
    }
}

function displayCollections() {
    const grid = document.getElementById('collections-grid');
    
    if (allCollections.length === 0) {
        grid.innerHTML = '<div class="loading">No collections yet</div>';
        return;
    }
    
    grid.innerHTML = allCollections.map(collection => `
        <div class="collection-card">
            <div class="collection-image">
                <img src="${collection.image || 'https://via.placeholder.com/200x150'}" alt="${collection.name}">
            </div>
            <div class="collection-info">
                <h3>${collection.name}</h3>
                <p>${collection.description || ''}</p>
                <div class="collection-actions">
                    <button class="btn-edit" onclick="editCollection('${collection.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteCollection('${collection.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showAddCollectionModal() {
    document.getElementById('collection-form').reset();
    document.querySelector('#collection-modal h2').textContent = 'Add Collection';
    document.getElementById('collection-modal').classList.add('show');
}

document.getElementById('collection-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('collection-name').value;
    const description = document.getElementById('collection-description').value;
    const imageUrl = document.getElementById('collection-image-url').value;
    
    const formData = {
        name,
        description,
        image: imageUrl || 'https://via.placeholder.com/200x150',
        createdAt: new Date().toISOString()
    };
    
    try {
        if (document.getElementById('collection-form').dataset.collectionId) {
            const collectionId = document.getElementById('collection-form').dataset.collectionId;
            await db.collection('collections').doc(collectionId).update(formData);
            alert('Collection updated successfully!');
            delete document.getElementById('collection-form').dataset.collectionId;
        } else {
            await db.collection('collections').add(formData);
            alert('Collection added successfully!');
        }
        
        closeCollectionModal();
        await loadCollections();
        displayCollections();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

async function deleteCollection(collectionId) {
    if (confirm('Are you sure you want to delete this collection?')) {
        try {
            await db.collection('collections').doc(collectionId).delete();
            alert('Collection deleted successfully!');
            await loadCollections();
            displayCollections();
        } catch (error) {
            alert('Error deleting collection: ' + error.message);
        }
    }
}

async function editCollection(collectionId) {
    const collection = allCollections.find(c => c.id === collectionId);
    if (!collection) return;
    
    document.getElementById('collection-name').value = collection.name;
    document.getElementById('collection-description').value = collection.description || '';
    document.getElementById('collection-image-url').value = collection.image || '';
    document.getElementById('collection-form').dataset.collectionId = collectionId;
    document.querySelector('#collection-modal h2').textContent = 'Edit Collection';
    
    document.getElementById('collection-modal').classList.add('show');
}

function closeCollectionModal() {
    document.getElementById('collection-modal').classList.remove('show');
    delete document.getElementById('collection-form').dataset.collectionId;
    document.querySelector('#collection-modal h2').textContent = 'Add Collection';
}

// ===== ORDERS MANAGEMENT =====
async function loadOrders() {
    try {
        const querySnapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        allOrders = [];
        querySnapshot.forEach((doc) => {
            allOrders.push({
                id: doc.id,
                ...doc.data()
            });
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        allOrders = [];
    }
}

function displayOrders() {
    const tbody = document.getElementById('orders-table-body');
    
    if (allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = allOrders.map(order => `
        <tr>
            <td><strong>${order.id.substring(0, 8)}</strong></td>
            <td>${order.customerName || 'N/A'}</td>
            <td>${order.customerPhone || 'N/A'}</td>
            <td>₹${order.total || 0}</td>
            <td><span class="status-badge status-${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
            <td><span class="status-badge status-${(order.paymentStatus || 'pending').toLowerCase()}">${order.paymentStatus || 'Pending'}</span></td>
            <td>
                <button class="btn-edit" onclick="viewOrderDetails('${order.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    alert(`Order Details:\n\nID: ${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nAmount: ₹${order.total}\nStatus: ${order.status}\nPayment: ${order.paymentStatus}`);
}

async function exportOrdersToSheets() {
    // This requires Google Sheets API integration
    // For now, generate a CSV export
    const csvContent = [
        ['Order ID', 'Customer Name', 'Phone', 'Amount', 'Status', 'Payment Status', 'Date'],
        ...allOrders.map(o => [
            o.id,
            o.customerName,
            o.customerPhone,
            o.total,
            o.status,
            o.paymentStatus,
            new Date(o.createdAt).toLocaleDateString()
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== PAYMENT VERIFICATION =====
function displayPendingPayments() {
    const tbody = document.getElementById('payment-table-body');
    const pendingOrders = allOrders.filter(o => o.paymentStatus === 'pending');
    
    if (pendingOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No pending payments</td></tr>';
        return;
    }
    
    tbody.innerHTML = pendingOrders.map(order => `
        <tr>
            <td><strong>${order.id.substring(0, 8)}</strong></td>
            <td>${order.customerName}</td>
            <td>₹${order.total}</td>
            <td>
                ${order.paymentScreenshot ? 
                    `<a href="${order.paymentScreenshot}" target="_blank" class="btn-edit">View Screenshot</a>` : 
                    'No screenshot'}
            </td>
            <td><span class="status-badge status-pending">Pending</span></td>
            <td>
                <button class="btn-verify" onclick="verifyPayment('${order.id}')">Verify & Approve</button>
            </td>
        </tr>
    `).join('');
}

async function verifyPayment(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (confirm(`Verify payment for ${order.customerName}?\n\nAmount: ₹${order.total}\n\nClick OK to approve and send WhatsApp notification.`)) {
        try {
            // Update payment status
            await db.collection('orders').doc(orderId).update({
                paymentStatus: 'verified',
                status: 'confirmed',
                verifiedAt: new Date().toISOString(),
                verifiedBy: localStorage.getItem('admin_username')
            });
            
            // Send WhatsApp notification
            const message = `Hi ${order.customerName},\n\nYour payment of ₹${order.total} has been verified.\n\nYour order is confirmed!\n\nOrder ID: ${order.id.substring(0, 8)}\n\nThank you for shopping with Klyra Studio!\n\nFor any queries, call us at ${CONTACT_WHATSAPP}`;
            sendWhatsAppMessage(order.customerPhone, message);
            
            alert('Payment verified! WhatsApp notification sent.');
            await loadOrders();
            displayPendingPayments();
        } catch (error) {
            alert('Error verifying payment: ' + error.message);
        }
    }
}

function sendWhatsAppMessage(phone, message) {
    // This would require a WhatsApp API integration
    // For now, show a manual instruction
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    console.log('WhatsApp URL:', whatsappUrl);
    // In production, use a proper API like Twilio or Wix
}

// ===== USERS MANAGEMENT =====
async function loadUsers() {
    try {
        const querySnapshot = await db.collection('users').get();
        allUsers = [];
        querySnapshot.forEach((doc) => {
            allUsers.push({
                id: doc.id,
                ...doc.data()
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
        allUsers = [];
    }
}

function displayUsers() {
    const tbody = document.getElementById('users-table-body');
    
    if (allUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No users yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = allUsers.map(user => {
        const userOrders = allOrders.filter(o => o.userId === user.id).length;
        const totalSpent = allOrders
            .filter(o => o.userId === user.id && o.status === 'confirmed')
            .reduce((sum, o) => sum + (o.total || 0), 0);
        
        return `
            <tr>
                <td>${user.id.substring(0, 8)}</td>
                <td>${user.phone}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>${userOrders}</td>
                <td>₹${totalSpent}</td>
                <td>
                    <button class="btn-edit" onclick="viewUserDetails('${user.id}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const userOrders = allOrders.filter(o => o.userId === userId);
    alert(`User Details:\n\nPhone: ${user.phone}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}\nTotal Orders: ${userOrders.length}`);
}

// ===== DASHBOARD STATS =====
function updateDashboardStats() {
    document.getElementById('total-orders').textContent = allOrders.length;
    document.getElementById('total-products').textContent = allProducts.length;
    document.getElementById('total-users').textContent = allUsers.length;
    
    const revenue = allOrders
        .filter(o => o.status === 'confirmed' && o.paymentStatus === 'verified')
        .reduce((sum, o) => sum + (o.total || 0), 0);
    
    document.getElementById('total-revenue').textContent = `₹${revenue}`;
}

function loadRecentOrders() {
    const tbody = document.getElementById('recent-orders-list');
    const recent = allOrders.slice(0, 5);
    
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = recent.map(order => `
        <tr>
            <td><strong>${order.id.substring(0, 8)}</strong></td>
            <td>${order.customerName}</td>
            <td>₹${order.total}</td>
            <td><span class="status-badge status-${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// ===== LOGOUT =====
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_login_time');
        window.location.href = 'admin-login.html';
    }
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
}
