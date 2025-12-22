document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === 'admin' && pass === 'password') {
            localStorage.setItem('authenticated', 'true');
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.textContent = 'Invalid credentials. Hint: admin / password';
            errorDiv.classList.remove('hidden');
        }
    });
});
