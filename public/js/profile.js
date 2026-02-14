import {request} from './api.js';
import {renderHeader} from './ui.js';

let currentUserData = null;

async function init() {
    renderHeader();

    try {
        currentUserData = await request('/users/profile');

        renderProfileInfo(currentUserData);
        setupModal();
        setupTabs();
        renderTabContent('liked');
    } catch (err) {
        console.error("Profile load error:", err);
        if (err.message.includes('token')) {
            window.location.href = 'auth.html';
        }
    }
}

function renderProfileInfo(user) {
    document.getElementById('userEmail').innerText = user.email;
    document.getElementById('userBio').innerText = user.bio || "No bio information provided.";
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTabContent(tab.dataset.tab);
        };
    });
}

function renderTabContent(type) {
    const container = document.getElementById('tabContent');
    const items = type === 'liked' ? (currentUserData.likedPosts || []) : (currentUserData.following || []);

    if (items.length === 0) {
        container.innerHTML = `<p style="color: #888; padding: 20px 0;">No ${type} items to show.</p>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="list-item" style="border-bottom: 1px solid #eee; padding: 15px 0;">
            <a href="${type === 'liked' ? `post.html?id=${item._id}` : '#'}" 
               style="text-decoration: none; color: #333; font-weight: 500;">
                ${type === 'liked' ? item.title : item.email}
            </a>
            <p style="font-size: 0.8rem; color: #999; margin-top: 5px;">
                ${type === 'liked' ? 'Click to read post' : 'Creator you follow'}
            </p>
        </div>
    `).join('');
}

function setupModal() {
    const modal = document.getElementById('editModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const bioInput = document.getElementById('editBio');

    openBtn.onclick = () => {
        bioInput.value = currentUserData.bio || "";
        modal.style.display = 'flex';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };

    saveBtn.onclick = async () => {
        try {
            const updated = await request('/users/profile', {
                method: 'PUT',
                body: JSON.stringify({bio: bioInput.value})
            });

            currentUserData.bio = updated.bio;
            renderProfileInfo(currentUserData);
            modal.style.display = 'none';
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };
}

init();