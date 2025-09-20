// PUBLIC BLOG - No authentication needed for visitors
class PublicBlog {
    constructor() {
        this.posts = [];
        this.loadPosts();
    }

    async loadPosts() {
        try {
            const grid = document.getElementById('gridBlogPosts');
            grid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: #64748b;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                    <h3>Loading posts...</h3>
                </div>
            `;

            // Load posts from GitHub (PUBLIC URL - no token needed)
            const response = await fetch('https://raw.githubusercontent.com/BishalChaudhary98/Bantha-Cleaning/main/posts/posts.json');
            
            if (response.ok) {
                this.posts = await response.json();
                this.render();
            } else {
                this.showNoPostsMessage();
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showNoPostsMessage();
        }
    }

    render() {
        const grid = document.getElementById('gridBlogPosts');
        
        if (!this.posts || this.posts.length === 0) {
            this.showNoPostsMessage();
            return;
        }

        // Sort posts by date (newest first)
        const sortedPosts = [...this.posts].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        grid.innerHTML = sortedPosts.map(post => {
            let imageDisplay;
            if (post.images && post.images.length > 1) {
                imageDisplay = `
                    <img src="${post.images[0]}" alt="${post.title}" onerror="this.style.display='none'">
                    <div class="badge-image-count">📸 ${post.images.length}</div>
                `;
            } else if (post.image) {
                imageDisplay = `<img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">`;
            } else {
                imageDisplay = `<span>📝 ${post.title}</span>`;
            }

            return `
                <div class="card-blog" onclick="showFullPost('${post.id}')">
                    <div class="image-blog">
                        ${imageDisplay}
                    </div>
                    <div class="content-blog">
                        <div class="date-blog">${post.date}</div>
                        <h3 class="title-blog">${post.title}</h3>
                        <p class="excerpt-blog">${post.excerpt}</p>
                        <span class="link-read-more">Read More →</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    showNoPostsMessage() {
        const grid = document.getElementById('gridBlogPosts');
        grid.innerHTML = `
            <div class="state-empty">
                <h3>No posts yet</h3>
                <p>Check back soon for new cleaning tips and advice!</p>
            </div>
        `;
    }

    getPost(postId) {
        return this.posts.find(p => p.id === postId);
    }
}

// Global variables
let currentPost = null;
let blog = null;

// Show full post in modal
function showFullPost(postId) {
    const post = blog.getPost(postId);
    if (!post) return;

    currentPost = post;

    document.getElementById('titleModal').textContent = post.title;
    document.getElementById('dateModal').textContent = post.date;
    
    // Format content with proper line breaks
    let formattedContent = post.content;
    formattedContent = formattedContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let paragraphs = formattedContent.split(/\n\s*\n/);
    
    if (paragraphs.length === 1) {
        paragraphs = formattedContent.split('\n');
    }
    
    formattedContent = paragraphs
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => {
            const formattedParagraph = paragraph.replace(/\n/g, '<br>');
            return `<p>${formattedParagraph}</p>`;
        })
        .join('');
    
    document.getElementById('contentModal').innerHTML = formattedContent;

    // Handle images
    showImageGallery();

    // Show modal
    document.getElementById('modalPost').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Image gallery functions
function showImageGallery() {
    const modalImages = document.getElementById('sectionModalImages');
    
    if (currentPost.images && currentPost.images.length > 0) {
        if (currentPost.images.length === 1) {
            modalImages.innerHTML = `<img src="${currentPost.images[0]}" alt="${currentPost.title}">`;
        } else {
            modalImages.innerHTML = `
                <div class="grid-images-modal">
                    ${currentPost.images.map(img => `<img src="${img}" alt="${currentPost.title}" onclick="showLargeImage('${img}')">`).join('')}
                </div>
            `;
        }
    } else if (currentPost.image) {
        modalImages.innerHTML = `<img src="${currentPost.image}" alt="${currentPost.title}">`;
    } else {
        modalImages.innerHTML = `
            <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                📝 ${currentPost.title}
            </div>
        `;
    }
}

function showLargeImage(imageSrc) {
    const modalImages = document.getElementById('sectionModalImages');
    modalImages.innerHTML = `
        <img src="${imageSrc}" alt="Large view">
        <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;" onclick="showImageGallery()">
            ← Back to Gallery
        </div>
    `;
}

function closeModal() {
    document.getElementById('modalPost').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPost = null;
}

// Event listeners
window.addEventListener('click', function(e) {
    const modal = document.getElementById('modalPost');
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize blog when page loads
document.addEventListener('DOMContentLoaded', function() {
    blog = new PublicBlog();
});

// Auto-refresh every 5 minutes to check for new posts
setInterval(() => {
    if (blog) {
        blog.loadPosts();
    }
}, 300000); // 5 minutes
