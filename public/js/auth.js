import { request } from './api.js';

const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const registerFields = document.getElementById('registerOnlyFields');
const toggleLink = document.getElementById('toggleAuth');
const submitBtn = document.getElementById('submitBtn');

let isLogin = true;

toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    authTitle.innerText = isLogin ? 'Login' : 'Register';
    submitBtn.innerText = isLogin ? 'Sign In' : 'Sign Up';
    registerFields.style.display = isLogin ? 'none' : 'block';
    toggleLink.innerText = isLogin ? 'Register' : 'Login';
    document.getElementById('toggleText').innerText = isLogin
        ? "Don't have an account?"
        : "Already have an account?";
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { email, password, role };

    try {
        const data = await request(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);

        alert('Success! Redirecting...');
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message);
    }
});