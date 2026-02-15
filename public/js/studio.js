import {request} from './api.js';
import {renderHeader} from './ui.js';

async function init() {
    renderHeader();
    const currentUserId = localStorage.getItem('userId');
    const container = document.getElementById('myPostsList');
    setupCreateForm();
    try {
        const allPosts = await request('/posts');
        const myPosts = allPosts.filter(p => {
            const authorId = String(p.author?._id || p.author);
            const myId = String(currentUserId);
            return authorId === myId;
        });

        if (myPosts.length === 0) {
            container.innerHTML = '<p>You haven\'t created any posts yet.</p>';
            return;
        }

        container.innerHTML = myPosts.map(post => `
            <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                <span><strong>${post.title}</strong></span>
                <div>
                    <button onclick="window.location.href='post.html?id=${post._id}'" class="btn-sm">View</button>
                    <button onclick="window.deletePost('${post._id}')" style="color:red; margin-left:10px; cursor:pointer;">Delete</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Studio error:", err);
    }
}
function setupCreateForm() {
    const form = document.getElementById('createPostForm');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const tags = document.getElementById('postTags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t !== "");

        const postData = { title, content, tags };

        try {
            const result = await request('/posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            });

            console.log("Post created:", result);
            alert("Post published successfully!");
            form.reset();
            init();
        } catch (err) {
            console.error("Creation error:", err);
            alert("Failed to create post: " + err.message);
        }
    };
}

window.deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
        await request(`/posts/${id}`, {method: 'DELETE'});
        init();
    } catch (err) {
        alert(err.message);
    }
};

init();