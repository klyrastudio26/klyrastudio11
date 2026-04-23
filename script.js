const BUSINESS_NAME = 'KlyraStudio';
const INSTAGRAM_URL = 'https://www.instagram.com/klyrastudio';
const WHATSAPP_NUMBER = '+91 063811 63108';
const PAYMENT_UPI = 'keerthi8015-2@okaxis';
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
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
];

let products = [];
let cart = [];
let slideshowImages = [];
let currentSlide = 0;

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');

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

function loadOrders() {
  const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = loadOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
}

function renderSlideshow() {
  const container = document.getElementById('slideshowContainer');
  container.innerHTML = '';
  slideshowImages.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.backgroundImage = `url('${image}')`;
    if (index === currentSlide) slide.classList.add('active');
    container.appendChild(slide);
  });
}

function changeSlide(direction) {
  currentSlide = (currentSlide + direction + slideshowImages.length) % slideshowImages.length;
  renderSlideshow();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p>No items added yet.</p>';
    cartTotal.textContent = '₹0';
    return;
  }

  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const line = document.createElement('div');
    line.className = 'cart-item';
    line.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>
        ₹${(item.price * item.quantity).toLocaleString()} 
        <button data-remove="${index}">Remove</button>
      </span>
    `;
    cartItems.appendChild(line);
  });

  cartTotal.textContent = `₹${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}`;
}

function addProductToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function setOrderMessage(message, success = true) {
  orderMessage.innerHTML = `<p>${message}</p>`;
  orderMessage.style.borderColor = success ? '#a9d6a9' : '#d68a8a';
  orderMessage.style.color = success ? '#c6f5d3' : '#ffd6d6';
}

function generateOrderId() {
  return `KS-${Date.now().toString().slice(-6)}`;
}

function handleCheckout(event) {
  event.preventDefault();
  if (!cart.length) {
    setOrderMessage('Please add at least one product to your cart before submitting.', false);
    return;
  }

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  if (!name || !phone || !address) {
    setOrderMessage('Please complete all order fields before submitting.', false);
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: generateOrderId(),
    customerName: name,
    phone,
    address,
    items: cart,
    total,
    status: 'Awaiting Payment Verification',
    paymentMethod: PAYMENT_UPI,
    whatsapp: WHATSAPP_NUMBER,
    createdAt: new Date().toISOString(),
  };

  saveOrder(order);
  cart = [];
  renderCart();
  orderForm.reset();

  setOrderMessage(`Order submitted successfully! Your order ID is <strong>${order.id}</strong>. Please pay ₹${order.total.toLocaleString()} to ${PAYMENT_UPI} and send the screenshot to WhatsApp ${WHATSAPP_NUMBER}. The admin will verify payment and confirm your order.`);
}

function initEventListeners() {
  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-product-id]');
    if (!button) return;
    addProductToCart(button.dataset.productId);
  });

  cartItems.addEventListener('click', (event) => {
    const removeButton = event.target.closest('button[data-remove]');
    if (!removeButton) return;
    removeCartItem(Number(removeButton.dataset.remove));
  });

  orderForm.addEventListener('submit', handleCheckout);
}

function init() {
  loadProducts();
  loadSlideshow();
  renderProducts();
  renderSlideshow();
  renderCart();
  initEventListeners();
  setInterval(() => changeSlide(1), 5000); // Auto slide every 5 seconds
}

init();
