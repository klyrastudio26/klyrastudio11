// Admin Authentication using Supabase Auth
const ADMIN_EMAIL = 'klyrastudio11@gmail.com';

async function initAdminAuth() {
    if (!window.supabase || typeof window.supabase.auth?.getSession !== 'function') {
        console.error('Supabase auth not available');
        return;
    }

    const { data, error } = await window.supabase.auth.getSession();
    if (error) {
        console.error('Supabase auth session error:', error);
        return;
    }

    const session = data?.session;
    if (session && session.user?.email === ADMIN_EMAIL) {
        window.location.href = 'admin-dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', initAdminAuth);

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (email !== ADMIN_EMAIL) {
        showError('Invalid email or password');
        return;
    }

    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password
        });

        if (error) {
            console.error('Supabase sign-in error:', error);
            showError('Invalid email or password');
            return;
        }

        const user = data.user;
        if (user.email !== ADMIN_EMAIL) {
            await window.supabase.auth.signOut();
            showError('Invalid admin account. Please contact support.');
            return;
        }

        localStorage.setItem('admin_email', ADMIN_EMAIL);
        showSuccess('Admin login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1200);
    } catch (error) {
        console.error('Admin login error:', error);
        showError('Login failed. Please try again.');
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

