export function renderHeader() {
    const header = document.getElementById('mainHeader');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    header.innerHTML = `
        <div class="container">
            <nav>
                <a href="index.html" class="logo">EcoBlog</a>
                <input type="text" id="searchInput" placeholder="Search posts..." class="search-input">
                <div class="nav-links">
                    ${token ? `
                        ${role === 'Creator' ? '<a href="studio.html">Studio</a>' : ''}
                        <a href="profile.html">Profile</a>
                        <a href="#" id="logoutBtn">Logout</a>
                    ` : '<a href="auth.html">Login</a>'}
                </div>
            </nav>
        </div>
    `;

    if (token) {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'auth.html';
        });
    }
}