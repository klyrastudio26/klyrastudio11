// User Authentication
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    if (!phone || !password) {
        showError('Please fill in all fields');
        return;
    }

    // For demo purposes: validate against stored user data
    // In production, use proper authentication
    try {
        // Check if user exists in Firestore
        const querySnapshot = await db.collection('users').where('phone', '==', phone).get();
        
        if (querySnapshot.empty) {
            showError('User not found. Please sign up first.');
            return;
        }

        const userData = querySnapshot.docs[0].data();
        
        // Simple password validation (in production, use proper hashing)
        if (userData.password !== password) {
            showError('Invalid password');
            return;
        }

        // Login successful
        localStorage.setItem('user_phone', phone);
        localStorage.setItem('user_id', querySnapshot.docs[0].id);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
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
