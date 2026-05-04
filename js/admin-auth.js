// Admin Authentication using Supabase Auth
const ADMIN_USERNAME = 'admin';
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
    if (session && session.user?.user_metadata?.username === ADMIN_USERNAME) {
        window.location.href = 'admin-dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', initAdminAuth);

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;

    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (username !== ADMIN_USERNAME) {
        showError('Invalid username or password');
        return;
    }

    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password
        });

        if (error) {
            console.error('Supabase sign-in error:', error);
            showError('Invalid username or password');
            return;
        }

        const user = data.user;
        const metadataUsername = user?.user_metadata?.username;
        if (metadataUsername !== ADMIN_USERNAME) {
            await window.supabase.auth.signOut();
            showError('Invalid admin account. Please contact support.');
            return;
        }

        localStorage.setItem('admin_username', ADMIN_USERNAME);
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

