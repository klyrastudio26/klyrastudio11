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

// Wait for db to be defined globally
async function waitForDB() {
  let attempts = 0;
  while (typeof db === 'undefined' && attempts < 100) {
    await new Promise(resolve => setTimeout(resolve, 50));
    attempts++;
  }
  
  if (typeof db === 'undefined') {
    console.error('❌ DB failed to load');
    return false;
  }
  
  try {
    await db.initPromise;
    return true;
  } catch (e) {
    console.error('DB init error:', e);
    return false;
  }
}

// Check admin authentication on page load
window.addEventListener('load', async () => {
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    const adminName = localStorage.getItem('admin_username');
    document.getElementById('admin-name').textContent = adminName || 'Admin';
    
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Wait for db to be ready
        const dbReady = await waitForDB();
        if (!dbReady) {
            console.error('DB not ready');
            return;
        }
        
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
        'slideshow': 'Manage Slideshow',
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
    } else if (tabName === 'slideshow') {
        displaySlides();
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
        console.log('📦 Admin: Loading products...');
        let querySnapshot;

        if (window.supabase && typeof window.supabase.from === 'function') {
            const { data, error } = await window.supabase.from('products').select('*');
            if (error) {
                console.error('❌ Supabase fetch error:', error);
                throw error;
            }
            querySnapshot = {
                docs: data.map(item => ({
                    id: item.id,
                    data: () => {
                        const copy = { ...item };
                        delete copy.id;
                        return copy;
                    }
                })),
                forEach: callback => data.forEach(item => callback({
                    id: item.id,
                    data: () => {
                        const copy = { ...item };
                        delete copy.id;
                        return copy;
                    }
                }))
            };
            console.log('✓ Fetched', data.length, 'products from Supabase');
        } else {
            querySnapshot = await db.collection('products').get();
            console.log('✓ Got query snapshot, docs count:', querySnapshot.docs ? querySnapshot.docs.length : 'unknown');
        }
        
        allProducts = [];
        querySnapshot.forEach((doc) => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log('✓ Loaded ' + allProducts.length + ' products from admin');
    } catch (error) {
        console.error('❌ Error loading products:', error);
        allProducts = [];
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
    const imageFile = document.getElementById('product-image').files[0];
    
    try {
        let imageData = 'https://via.placeholder.com/280x250';
        
        // Handle image upload
        if (imageFile) {
            if (window.supabase) {
                // Upload to Supabase Storage
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { data, error } = await window.supabase.storage.from('products').upload(fileName, imageFile);
                if (error) throw error;
                const { data: urlData } = window.supabase.storage.from('products').getPublicUrl(fileName);
                imageData = urlData.publicUrl;
                console.log('✓ Image uploaded to Supabase Storage:', imageData);
            } else {
                // Fallback to base64 for local storage
                imageData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(imageFile);
                });
                console.log('✓ Image converted to base64');
            }
        }
        
        console.log('📝 Adding product:', name, 'to collection:', collection);
        console.log('🧪 Supabase object present:', !!window.supabase, 'from function:', typeof window.supabase?.from);
        const productPayload = {
            name,
            collection,
            price,
            description,
            image: imageData,
            createdAt: new Date().toISOString()
        };

        if (window.supabase && typeof window.supabase.from === 'function') {
            const { data: result, error } = await window.supabase.from('products').insert(productPayload).select().single();
            if (error) {
                console.error('❌ Supabase insert error:', error);
                throw error;
            }
            console.log('✓ Product inserted into Supabase:', result);
        } else {
            await db.collection('products').add(productPayload);
            console.log('⚠️ Product saved to local fallback storage because Supabase was not ready');
        }
        
        alert('✓ Product added successfully!');
        closeProductModal();
        await loadProducts();
        displayProducts();
        console.log('✓ Product display updated');
    } catch (error) {
        console.error('❌ Error adding product:', error);
        alert('❌ Error adding product: ' + error.message);
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
        // Only load from IndexedDB/localStorage to avoid Supabase schema errors
        const collections = JSON.parse(localStorage.getItem('collections') || '[]');
        allCollections = collections;
        console.log('✓ Loaded collections from localStorage:', allCollections.length);
    } catch (error) {
        console.error('Error loading collections:', error);
        allCollections = [];
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
    const imageFile = document.getElementById('collection-image').files[0];
    
    try {
        let imageData = 'https://via.placeholder.com/200x150';
        
        // Convert image file to base64
        if (imageFile) {
            imageData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(imageFile);
            });
        }
        
        const formData = {
            name,
            description,
            image: imageData,
            createdAt: new Date().toISOString()
        };
        
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
        const querySnapshot = await db.collection('orders').get();
        allOrders = [];
        querySnapshot.forEach((doc) => {
            allOrders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        // Sort by createdAt in descending order
        allOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        allOrders = [];
    }
}

function displayOrders() {
    const tbody = document.getElementById('orders-table-body');
    
    if (allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">No orders yet</td></tr>';
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
                <button class="btn-edit" onclick="verifyOrderPayment('${order.id}')" style="padding: 5px 8px; margin-right: 3px; font-size: 11px;">💳 Verify</button>
                <button class="btn-edit" onclick="markOrderShipped('${order.id}')" style="padding: 5px 8px; margin-right: 3px; font-size: 11px; background-color: #17a2b8;">🚚 Shipped</button>
                <button class="btn-edit" onclick="markOrderDelivered('${order.id}')" style="padding: 5px 8px; margin-right: 3px; font-size: 11px; background-color: #28a745;">📦 Delivered</button>
                <button class="btn-delete" onclick="deleteOrder('${order.id}')" style="padding: 5px 8px; font-size: 11px; background-color: #dc3545;">🗑️ Delete</button>
            </td>
        </tr>
    `).join('');
}

async function verifyOrderPayment(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (confirm(`Verify payment for ${order.customerName}?\n\nAmount: ₹${order.total}`)) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const index = orders.findIndex(o => o.id === orderId);
            if (index >= 0) {
                orders[index].paymentStatus = 'verified';
                orders[index].verifiedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
            }
            
            // Update in IndexedDB
            await db.collection('orders').doc(orderId).update({
                paymentStatus: 'verified',
                verifiedAt: new Date().toISOString(),
                status: 'confirmed'
            });
            
            allOrders[index].paymentStatus = 'verified';
            allOrders[index].status = 'confirmed';
            displayOrders();
            alert('✅ Payment verified! Order status changed to Confirmed.');
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('❌ Error: ' + error.message);
        }
    }
}

async function markOrderShipped(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const trackingId = prompt(`Mark order as SHIPPED for ${order.customerName}?\n\nEnter tracking ID (optional):`, '');
    if (trackingId !== null) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const index = orders.findIndex(o => o.id === orderId);
            if (index >= 0) {
                orders[index].status = 'shipped';
                orders[index].trackingId = trackingId || 'N/A';
                orders[index].shippedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
            }
            
            // Update in IndexedDB
            await db.collection('orders').doc(orderId).update({
                status: 'shipped',
                trackingId: trackingId || 'N/A',
                shippedAt: new Date().toISOString()
            });
            
            allOrders[index].status = 'shipped';
            allOrders[index].trackingId = trackingId || 'N/A';
            displayOrders();
            
            // Send WhatsApp notification
            console.log('📤 Sending WhatsApp: Order shipped with tracking ID:', trackingId);
            sendShippingNotification(order.customerPhone, order.customerName, orderId, trackingId);
            
            alert('🚚 Order marked as SHIPPED!\n\nTracking ID: ' + (trackingId || 'N/A'));
        } catch (error) {
            console.error('Error marking as shipped:', error);
            alert('❌ Error: ' + error.message);
        }
    }
}

async function markOrderDelivered(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (confirm(`Mark order as DELIVERED for ${order.customerName}?\n\nAmount: ₹${order.total}\n\n(Customer must confirm delivery)`)) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const index = orders.findIndex(o => o.id === orderId);
            if (index >= 0) {
                orders[index].status = 'delivered';
                orders[index].deliveredAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
            }
            
            // Update in IndexedDB
            await db.collection('orders').doc(orderId).update({
                status: 'delivered',
                deliveredAt: new Date().toISOString()
            });
            
            allOrders[index].status = 'delivered';
            displayOrders();
            
            // Send WhatsApp notification
            console.log('📤 Sending WhatsApp: Order delivered');
            sendDeliveryNotification(order.customerPhone, order.customerName, orderId);
            
            alert('📦 Order marked as DELIVERED!\n\nCustomer will receive a WhatsApp confirmation.');
        } catch (error) {
            console.error('Error marking as delivered:', error);
            alert('❌ Error: ' + error.message);
        }
    }
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

async function deleteOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (confirm(`Delete order #${orderId.substring(0, 8)} from ${order.customerName}?\n\nAmount: ₹${order.total}\n\nThis action cannot be undone.`)) {
        try {
            console.log('🗑️  Deleting order:', orderId);
            await db.collection('orders').doc(orderId).delete();
            console.log('✓ Order deleted from database');
            
            alert('✓ Order deleted successfully!');
            await loadOrders();
            displayOrders();
            console.log('✓ Orders list refreshed');
        } catch (error) {
            console.error('❌ Error deleting order:', error);
            alert('❌ Error deleting order: ' + error.message);
        }
    }
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
        const userOrders = allOrders.filter(o => o.customerPhone === user.phone).length;
        const totalSpent = allOrders
            .filter(o => o.customerPhone === user.phone && o.paymentStatus === 'verified')
            .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
        
        return `
            <tr>
                <td>${user.id.substring(0, 8)}</td>
                <td>${user.phone}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>${userOrders}</td>
                <td>₹${totalSpent.toFixed(2)}</td>
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
    
    const userOrders = allOrders.filter(o => o.customerPhone === user.phone);
    const totalSpent = userOrders
        .filter(o => o.paymentStatus === 'verified' || o.status === 'delivered')
        .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    alert(`User Details:\n\nPhone: ${user.phone}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}\nTotal Orders: ${userOrders.length}\nTotal Spent: ₹${totalSpent.toFixed(2)}`);
}

// ===== DASHBOARD STATS =====
function updateDashboardStats() {
    document.getElementById('total-orders').textContent = allOrders.length;
    document.getElementById('total-products').textContent = allProducts.length;
    document.getElementById('total-users').textContent = allUsers.length;
    
    const revenue = allOrders
        .filter(o => o.paymentStatus === 'verified' || o.status === 'delivered')
        .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    
    document.getElementById('total-revenue').textContent = `₹${revenue.toFixed(2)}`;
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

// ===== CLOSE PAYMENT MODAL =====
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== WHATSAPP NOTIFICATION FUNCTIONS =====
function sendShippingNotification(phone, customerName, orderId, trackingId) {
    // Format phone number for WhatsApp
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Hi ${customerName},\n\n📦 Your Klyra Studio order is on the way!\n\nOrder ID: ${orderId.substring(0, 8)}\n🚚 Tracking ID: ${trackingId || 'Will be shared soon'}\n\nYour jewelry will be delivered with utmost care.\n\nFor any queries, reach us on WhatsApp: ${CONTACT_WHATSAPP}\n\n✨ Thank you for shopping with Klyra Studio!`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(message).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = message;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
    
    // WhatsApp link
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    showWhatsAppModal(customerName, message, whatsappLink, phone);
}

function sendDeliveryNotification(phone, customerName, orderId) {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Hi ${customerName},\n\n✅ Your Klyra Studio order has been delivered!\n\nOrder ID: ${orderId.substring(0, 8)}\n\nPlease confirm receipt and let us know about your experience.\n\n💎 We hope you love your jewelry!\n\n✨ Thank you for shopping with Klyra Studio!\n\nFor any queries, reach us on WhatsApp: ${CONTACT_WHATSAPP}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(message).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = message;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
    
    // WhatsApp link
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    showWhatsAppModal(customerName, message, whatsappLink, phone);
}

function showWhatsAppModal(customerName, message, whatsappLink, phone) {
    const modal = document.createElement('div');
    modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 10000;`;
    
    modal.innerHTML = `<div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-height: 80vh; overflow-y: auto;">
        <h2 style="margin-bottom: 15px; color: #d4af37; display: flex; align-items: center; gap: 10px;"><span>📱</span> WhatsApp Message Ready</h2>
        <p style="color: #666; margin-bottom: 15px;">To: <strong>${customerName}</strong> (${phone})</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #25d366;">
            <pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 13px; line-height: 1.6; margin: 0;">${message}</pre>
        </div>
        
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button onclick="this.closest('div').closest('div').remove()" style="flex: 1; padding: 12px; background: #ddd; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">❌ Close</button>
            <a href="${whatsappLink}" target="_blank" style="flex: 1; padding: 12px; background: #25d366; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 5px;">💬 Open WhatsApp</a>
        </div>
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">✓ Message copied to clipboard | Click button to send</p>
    </div>`;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ===== EXPOSE FUNCTIONS TO WINDOW (GLOBAL SCOPE) =====
window.switchTab = switchTab;
window.closeProductModal = closeProductModal;
window.closeCollectionModal = closeCollectionModal;
window.deleteProduct = deleteProduct;
window.deleteCollection = deleteCollection;
window.editProduct = editProduct;
window.editCollection = editCollection;
window.viewUserDetails = viewUserDetails;
window.toggleSidebar = toggleSidebar;
window.showAddProductModal = showAddProductModal;
window.showAddCollectionModal = showAddCollectionModal;
window.verifyOrderPayment = verifyOrderPayment;
window.markOrderShipped = markOrderShipped;
window.markOrderDelivered = markOrderDelivered;
window.verifyPayment = verifyPayment;
window.deleteOrder = deleteOrder;
window.exportOrdersToSheets = exportOrdersToSheets;
window.logout = logout;
