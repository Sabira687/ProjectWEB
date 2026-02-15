import {request} from './api.js';
import {renderHeader} from './ui.js';

let allPosts = [];

async function init() {
    renderHeader();
    await fetchPosts();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterPosts(e.target.value);
    });
}

async function fetchPosts() {
    try {
        const posts = await request('/posts');
        console.log("Response from server:", posts);

        if (!Array.isArray(posts)) {
            console.error("Not array!");
            return;
        }
        allPosts = posts;

        if (allPosts.length === 0) {
            document.getElementById('postsContainer').innerHTML = "<p>No posts found in database.</p>";
            return;
        }

        renderPosts(allPosts);
        if (document.getElementById('tagList')) {
            renderTags(allPosts);
        }

    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = posts.map(post => `
        <article class="post-card">
            <h2>${post.title}</h2>
            <p>${post.content.substring(0, 150)}...</p>
            <div class="post-meta">
                <div>
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <span>By <strong>${post.author && post.author.email ? post.author.email : 'Unknown'}</strong></span>
            </div>
            <button class="btn" onclick="window.location.href='post.html?id=${post._id}'" style="margin-top: 15px;">
                Read More
            </button>
        </article>
    `).join('');
}

function renderTags(posts) {
    const tags = [...new Set(posts.flatMap(p => p.tags))];
    const container = document.getElementById('tagList');
    container.innerHTML = tags.map(tag => `
        <span class="tag" onclick="window.filterByTag('${tag}')">#${tag}</span>
    `).join('');
}

function filterPosts(query) {
    const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );
    renderPosts(filtered);
}

window.filterByTag = (tag) => {
    const filtered = allPosts.filter(post => post.tags.includes(tag));
    renderPosts(filtered);
};

init();