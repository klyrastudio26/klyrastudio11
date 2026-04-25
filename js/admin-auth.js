// Admin Authentication
// Hardcoded admin credentials (change in production)
const ADMIN_USERNAME = 'Klyrastudio11';
const ADMIN_PASSWORD = 'Klyrastudio@11';

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;

    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Validate admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Generate admin session token
        const adminToken = btoa(username + ':' + Date.now());
        localStorage.setItem('admin_session', adminToken);
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_login_time', new Date().toISOString());
        
        showSuccess('Admin login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    } else {
        showError('Invalid username or password');
        // Log failed attempt
        console.warn('Failed admin login attempt at', new Date().toISOString());
    }
});

function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        document.querySelector('form').insertBefore(errorDiv, document.querySelector('form').firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => errorDiv.classList.remove('show'), 4000);
}

function showSuccess(message) {
    let successDiv = document.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        document.querySelector('form').insertBefore(successDiv, document.querySelector('form').firstChild);
    }
    successDiv.textContent = message;
    successDiv.classList.add('show');
}

// Check if already logged in as admin
window.addEventListener('load', () => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
        window.location.href = 'admin-dashboard.html';
    }
});
