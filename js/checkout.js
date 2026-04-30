// Checkout Page
const PAYMENT_UPI = 'keerthi8015-2@okaxis';
const CONTACT_WHATSAPP = '063811 63108';

let checkoutData = null;
let currentStep = 1;

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

document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutData();
    setupPaymentScreenshotUpload();
});

function loadCheckoutData() {
    const data = sessionStorage.getItem('checkout_data');
    if (!data) {
        // If no checkout data in sessionStorage, redirect to home
        // User should add items to cart from home page first
        alert('Please add items to your cart from the home page first.');
        window.location.href = '../index.html';
        return;
    }

    checkoutData = JSON.parse(data);
    displayOrderReview();
    document.getElementById('whatsapp-number').textContent = CONTACT_WHATSAPP;
}

function displayOrderReview() {
    const itemsContainer = document.getElementById('order-items');
    const items = checkoutData.items.map(item => `
        <div class="product-item">
            <div class="product-image">
                <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            </div>
            <div class="product-details">
                <div class="product-name">${item.name}</div>
                <div class="product-price">₹${item.price}</div>
                <div class="product-quantity">Quantity: ${item.quantity}</div>
            </div>
        </div>
    `).join('');

    itemsContainer.innerHTML = items;
    
    // Display summary
    document.getElementById('review-subtotal').textContent = `₹${checkoutData.subtotal}`;
    document.getElementById('review-tax').textContent = `₹${checkoutData.tax}`;
    document.getElementById('review-total').textContent = `₹${checkoutData.total}`;
    
    // Display payment amount
    document.getElementById('payment-amount').textContent = `₹${checkoutData.total}`;
}

function goToStep(step) {
    console.log('🔄 goToStep called with step:', step);
    
    // Validate current step before moving to next
    if (step === 2 && currentStep === 1) {
        console.log('Moving from step 1 to 2 (shipping)');
        // Just change the step
    }

    if (step === 3 && currentStep === 2) {
        console.log('Validating shipping form before moving to payment');
        if (!validateShippingForm()) {
            console.log('❌ Shipping form validation failed');
            return;
        }
    }

    currentStep = step;
    console.log('Current step is now:', currentStep);

    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

    // Show current step
    if (step === 1) {
        console.log('Showing review step');
        document.getElementById('review-step').classList.add('active');
    } else if (step === 2) {
        console.log('Showing shipping step');
        document.getElementById('shipping-step').classList.add('active');
    } else if (step === 3) {
        console.log('Showing payment step');
        document.getElementById('payment-step').classList.add('active');
    }

    const stepElement = document.getElementById('step-' + step);
    if (stepElement) {
        stepElement.classList.add('active');
        console.log('✓ Step', step, 'activated');
    } else {
        console.error('❌ Step element not found: step-' + step);
    }
}

function validateShippingForm() {
    const requiredFields = ['full-name', 'phone-number', 'email', 'address', 'city', 'state', 'postal-code'];
    
    for (let field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            alert(`Please fill in the ${input.previousElementSibling.textContent.toLowerCase()}`);
            return false;
        }
    }

    // Validate phone
    const phone = document.getElementById('phone-number').value;
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }

    // Validate email
    const email = document.getElementById('email').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    return true;
}

function setupPaymentScreenshotUpload() {
    const fileInput = document.getElementById('payment-screenshot');
    const label = document.createElement('label');
    label.className = 'file-upload-label';
    label.htmlFor = 'payment-screenshot';
    label.innerHTML = '<i class="fas fa-upload"></i> Click to Upload Screenshot';
    label.style.display = 'inline-block';
    label.style.marginBottom = '15px';

    // Insert label after the file input
    fileInput.parentNode.insertBefore(label, fileInput.nextSibling);

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            label.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
            label.style.backgroundColor = '#27ae60';
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const button = event.target.closest('.btn-copy');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    });
}

async function submitOrder() {
    // Validate payment screenshot
    const fileInput = document.getElementById('payment-screenshot');
    if (!fileInput.files.length) {
        alert('Please upload a payment screenshot');
        return;
    }

    // Validate file size (max 5MB)
    if (fileInput.files[0].size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Get shipping details
    const shippingData = {
        fullName: document.getElementById('full-name').value,
        phone: document.getElementById('phone-number').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postalCode: document.getElementById('postal-code').value,
        country: document.getElementById('country').value
    };

    try {
        // Upload payment screenshot
        const screenshotURL = await uploadPaymentScreenshot(fileInput.files[0]);

        // Generate order ID
        const orderId = 'KLY' + Date.now();

        // Create order in Firestore
        const orderData = {
            id: orderId,
            items: checkoutData.items,
            subtotal: checkoutData.subtotal,
            tax: checkoutData.tax,
            total: checkoutData.total,
            customerName: shippingData.fullName,
            customerPhone: shippingData.phone,
            customerEmail: shippingData.email,
            shipping: shippingData,
            paymentScreenshot: screenshotURL,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            upiId: PAYMENT_UPI
        };

        // Save to Firestore
        await db.collection('orders').doc(orderId).set(orderData);

        // Send WhatsApp notification
        sendOrderWhatsApp(shippingData.phone, orderData);

        // Show success modal
        showSuccessModal(orderId, checkoutData.total);

        // Clear cart and session
        localStorage.removeItem('klyra_cart');
        sessionStorage.removeItem('checkout_data');

    } catch (error) {
        console.error('Order submission error:', error);
        alert('Error submitting order: ' + error.message);
    }
}

async function uploadPaymentScreenshot(file) {
    return new Promise((resolve, reject) => {
        // For this demo, convert file to base64 and store URL
        const reader = new FileReader();
        reader.onload = (e) => {
            // In production, upload to Firebase Storage
            const dataURL = e.target.result;
            resolve(dataURL);
        };
        reader.onerror = () => {
            reject(new Error('File reading failed'));
        };
        reader.readAsDataURL(file);
    });
}

function sendOrderWhatsApp(phone, orderData) {
    const message = `Hi ${orderData.customerName},\n\n✓ Your order has been placed successfully!\n\n📦 Order ID: ${orderData.id}\n💰 Amount: ₹${orderData.total}\n\n⏳ Status: Awaiting payment verification\n\n📤 You have uploaded the payment screenshot. Our admin will verify it shortly.\n\n🎁 Thank you for shopping with Klyra Studio!\n\nFor any queries, call: ${CONTACT_WHATSAPP}`;
    
    // This would require WhatsApp Business API integration
    // For now, log the message
    console.log('WhatsApp Message would be sent to:', phone);
    console.log('Message:', message);
    
    // In production, send via Twilio or WhatsApp Business API
}

function showSuccessModal(orderId, total) {
    const modal = document.getElementById('success-modal');
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('order-amount').textContent = `₹${total}`;
    document.getElementById('success-message').textContent = 
        'Your payment screenshot has been received. Our admin will verify the payment and confirm your order soon. You will receive a WhatsApp notification once verified.';
    
    modal.classList.add('show');
}

function goHome() {
    window.location.href = '../index.html';
}

// ===== User Signup Page =====
// This is for the user-signup.html page
if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = document.getElementById('signup-phone').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showSignupError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showSignupError('Password must be at least 6 characters');
            return;
        }

        try {
            // Wait for db to be ready
            const dbReady = await waitForDB();
            if (!dbReady) {
                showSignupError('Database connection failed. Please try again.');
                return;
            }

            // Check if user already exists
            const existingUser = await db.collection('users').where('phone', '==', phone).get();
            
            if (!existingUser.empty) {
                showSignupError('Phone number already registered');
                return;
            }

            // Create new user
            await db.collection('users').add({
                phone: phone,
                password: password, // In production, use proper hashing
                createdAt: new Date().toISOString()
            });

            // Save user data to localStorage
            localStorage.setItem('user_phone', phone);
            localStorage.setItem('user_data', JSON.stringify({phone}));

            showSignupSuccess('Account created successfully! Redirecting to home...');
            setTimeout(() => {
                // Stay on home page with cart preserved
                window.location.href = '../index.html';
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            showSignupError('Signup failed. Please try again.');
        }
    });
}

function showSignupError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        document.querySelector('#signup-form').insertBefore(errorDiv, document.querySelector('#signup-form').firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => errorDiv.classList.remove('show'), 4000);
}

function showSignupSuccess(message) {
    let successDiv = document.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        document.querySelector('#signup-form').insertBefore(successDiv, document.querySelector('#signup-form').firstChild);
    }
    successDiv.textContent = message;
    successDiv.classList.add('show');
}

// ===== EXPOSE FUNCTIONS TO WINDOW (GLOBAL SCOPE) =====
window.goToStep = goToStep;
window.validateShippingForm = validateShippingForm;
window.completeOrder = completeOrder;
window.proceedToCheckout = proceedToCheckout;
