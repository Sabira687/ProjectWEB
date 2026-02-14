import {request} from './api.js';
import {renderHeader} from './ui.js';

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');
const currentUserId = localStorage.getItem('userId');

async function init() {
    renderHeader();
    if (!postId) return;

    try {
        const post = await request(`/posts/${postId}`);
        renderPost(post);
    } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById('postContent').innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    }
}

function renderPost(post) {
    const container = document.getElementById('postContent');
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = likesArray.includes(currentUserId);

    container.innerHTML = `
        <h1>${post.title}</h1>
        <div class="post-info">By: <strong>${post.author?.email || 'Unknown'}</strong></div>
        <div class="post-body" style="margin: 20px 0;">${post.content}</div>
    `;

    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');

    likeCount.innerText = likesArray.length;

    if (isLiked) {
        likeBtn.classList.add('active');
        likeBtn.innerHTML = `❤️ Liked (<span id="likeCount">${likesArray.length}</span>)`;
    } else {
        likeBtn.classList.remove('active');
        likeBtn.innerHTML = `🤍 Like (<span id="likeCount">${likesArray.length}</span>)`;
    }

    renderComments(post.comments || []);
    setupInteraction();
}

function renderComments(comments) {
    const list = document.getElementById('commentsList');
    const currentUserId = localStorage.getItem('userId');

    if (!comments || comments.length === 0) {
        list.innerHTML = '<p style="color: #888;">No comments yet.</p>';
        return;
    }

    list.innerHTML = comments.map(c => {
        const commentAuthorEmail = c.author?.email || 'Guest';
        const commentAuthorId = c.author?._id || c.author;
        const isMyComment = commentAuthorId === currentUserId;

        return `
            <div class="comment-item" style="
                border-bottom: 1px solid #eee; 
                padding: 15px 10px; 
                ${isMyComment ? 'background-color: #f9fbf9;' : ''}
            ">
                <div style="display: flex; justify-content: space-between;">
                    <strong>${commentAuthorEmail}</strong>
                    ${isMyComment ? `
                        <button onclick="window.deleteComment('${c._id}')" 
                                style="color: #e74c3c; background: none; border: none; cursor: pointer; font-size: 0.8rem;">
                            Delete
                        </button>
                    ` : ''}
                </div>
                <p style="margin-top: 5px; color: #2c3e50;">
                    ${c.content || 'No text content'} 
                </p>
            </div>
        `;
    }).join('');
}

function setupInteraction() {
    document.getElementById('likeBtn').onclick = async () => {
        try {
            await request(`/posts/${postId}/like`, {method: 'POST'});
            const freshPost = await request(`/posts/${postId}`);
            renderPost(freshPost);
        } catch (err) {
            alert("Like error: " + err.message);
        }
    };

    document.getElementById('commentForm').onsubmit = async (e) => {
        e.preventDefault();
        const contentValue = document.getElementById('commentText').value;

        try {
            await request('/comments', {
                method: 'POST',
                body: JSON.stringify({
                    postId: postId,
                    content: contentValue
                })
            });

            document.getElementById('commentText').value = '';
            const freshPost = await request(`/posts/${postId}`);
            renderPost(freshPost);
        } catch (err) {
            alert("Comment error: " + err.message);
        }
    };
}

window.deleteComment = async (commentId) => {
    if (!confirm("Are you sure?")) return;
    try {
        await request(`/comments/${commentId}`, {method: 'DELETE'});
        const freshPost = await request(`/posts/${postId}`);
        renderPost(freshPost);
    } catch (err) {
        alert("Delete error: " + err.message);
    }
};

init();