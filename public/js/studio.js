import { request } from './api.js';
import { renderHeader } from './ui.js';

const createPostForm = document.getElementById('createPostForm');
const myPostsList = document.getElementById('myPostsList');

async function init() {
    const role = localStorage.getItem('role');

    if (role !== 'Creator') {
        alert('Access denied. Creators only.');
        window.location.href = 'index.html';
        return;
    }

    renderHeader();
    await loadMyPosts();
}

async function loadMyPosts() {
    try {
        const userId = localStorage.getItem('userId');
        const posts = await request(`/posts/author/${userId}`);
        renderMyPosts(posts);
    } catch (err) {
        console.error('Error loading posts:', err);
    }
}

function renderMyPosts(posts) {
    if (posts.length === 0) {
        myPostsList.innerHTML = '<p>You haven\'t published anything yet.</p>';
        return;
    }

    myPostsList.innerHTML = posts.map(post => `
        <div class="manage-item">
            <div>
                <strong>${post.title}</strong>
                <span style="color: #888; font-size: 0.8rem; margin-left: 10px;">${new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="manage-actions">
                <button class="btn btn-edit" onclick="editPost('${post._id}')">Edit</button>
                <button class="btn btn-delete" onclick="deletePost('${post._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    try {
        await request('/posts', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        alert('Post published successfully!');
        createPostForm.reset();
        await loadMyPosts();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

window.deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        await request(`/posts/${id}`, { method: 'DELETE' });
        await loadMyPosts();
    } catch (err) {
        alert(err.message);
    }
};

window.editPost = (id) => {
    console.log('Edit post:', id);
};

init();