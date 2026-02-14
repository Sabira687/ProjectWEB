import { request } from './api.js';
import { renderHeader } from './ui.js';

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

async function init() {
    renderHeader();
    if (!postId) { window.location.href = 'index.html'; return; }

    const post = await request(`/posts/${postId}`);
    renderPost(post);
    setupInteractions(post);
}

function renderPost(post) {
    document.getElementById('postContent').innerHTML = `
        <h1>${post.title}</h1>
        <div class="post-info">By ${post.author.name} | ${new Date(post.createdAt).toDateString()}</div>
        <div class="post-body">${post.content}</div>
        <div class="tags">${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
    `;
    document.getElementById('likeCount').innerText = post.likes?.length || 0;

    const commentsHtml = post.comments.map(c => `
        <div class="comment-item">
            <strong>${c.user.name}:</strong> <span>${c.text}</span>
        </div>
    `).join('');
    document.getElementById('commentsList').innerHTML = commentsHtml;
}

function setupInteractions(post) {
    const likeBtn = document.getElementById('likeBtn');

    likeBtn.onclick = async () => {
        try {
            const updatedPost = await request(`/posts/${postId}/like`, { method: 'POST' });
            document.getElementById('likeCount').innerText = updatedPost.likes.length;
            likeBtn.classList.toggle('active');
        } catch (err) { alert('Please login to like'); }
    };

    document.getElementById('commentForm').onsubmit = async (e) => {
        e.preventDefault();
        const text = document.getElementById('commentText').value;
        await request(`/posts/${postId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
        location.reload();
    };
}

init();