// Secure GitHub Configuration - No token in code!
const GITHUB_CONFIG = {
    owner: 'BishalChaudhary98',           // Replace with your actual GitHub username
    repo: 'Bantha-Cleaning',          // Replace with your actual repository name
    token: null,                     // Will be set securely
    branch: 'main'
};

// Secure token management
function getGitHubToken() {
    if (!GITHUB_CONFIG.token) {
        const token = prompt(`
🔐 GitHub Token Required

To load blog posts, please enter your GitHub Personal Access Token:

(This is secure - the token is not stored in the code)
        `);
        
        if (token && token.trim()) {
            GITHUB_CONFIG.token = token.trim();
            return token.trim();
        } else {
            alert('❌ Token is required to load blog posts.');
            return null;
        }
    }
    return GITHUB_CONFIG.token;
}

// GitHub API Helper
class GitHubAPI {
    constructor(config) {
        this.config = config;
        this.baseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents`;
    }

    async getFile(path) {
        const token = getGitHubToken();
        if (!token) return null;

        try {
            const response = await fetch(`${this.baseUrl}/${path}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404) {
                return null;
            }
            
            if (response.status === 401) {
                alert('❌ Invalid GitHub token. Please check your token.');
                GITHUB_CONFIG.token = null; // Reset token
                return null;
            }
            
            const data = await response.json();
            const content = atob(data.content);
            return {
                content: JSON.parse(content),
                sha: data.sha
            };
        } catch (error) {
            console.error('Error fetching file:', error);
            return null;
        }
    }
}

// GitHub Blog System
// GitHub Blog System (Debug Version)
class GitHubBlog {
    constructor() {
        this.api = new GitHubAPI(GITHUB_CONFIG);
        this.posts = [];
        this.loadPosts();
    }

    async loadPosts() {
        try {
            console.log('🔍 Starting to load posts...');
            console.log('⚙️ Config:', {
                owner: GITHUB_CONFIG.owner,
                repo: GITHUB_CONFIG.repo,
                branch: GITHUB_CONFIG.branch
            });

            // Show loading state
            const grid = document.getElementById('gridBlogPosts');
            grid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: #64748b;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                    <h3>Loading posts...</h3>
                    <p>You may be prompted for your GitHub token</p>
                </div>
            `;

            // Try to get posts index
            console.log('📂 Fetching posts.json...');
            const postsData = await this.api.getFile('posts/posts.json');
            
            console.log('📋 Posts data received:', postsData);
            
            if (postsData && postsData.content) {
                this.posts = postsData.content;
                console.log('✅ Posts loaded:', this.posts.length, 'posts');
                console.log('📝 Posts array:', this.posts);
            } else {
                this.posts = [];
                console.log('📭 No posts found or empty posts.json');
            }

            this.render();
        } catch (error) {
            console.error('💥 Error loading posts:', error);
            this.showError('Failed to load posts. Check console for details.');
        }
    }

    render() {
        console.log('🎨 Rendering posts...');
        const grid = document.getElementById('gridBlogPosts');
        
        if (this.posts.length === 0) {
            console.log('📭 No posts to display');
            grid.innerHTML = `
                <div class="state-empty">
                    <h3>No posts yet</h3>
                    <p>Posts will appear here once they're published!</p>
                    <button onclick="blog.loadPosts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        🔄 Refresh Posts
                    </button>
                </div>
            `;
            return;
        }

        console.log('📝 Rendering', this.posts.length, 'posts');

        // Sort posts by date (newest first)
        const sortedPosts = [...this.posts].sort((a, b) => {
            const dateA = new Date(a.dateCreated || a.date);
            const dateB = new Date(b.dateCreated || b.date);
            return dateB - dateA;
        });

        console.log('📅 Sorted posts:', sortedPosts);

        grid.innerHTML = sortedPosts.map((post, index) => {
            console.log(`🎯 Rendering post ${index + 1}:`, post.title);
            
            let imageDisplay;
            if (post.images && post.images.length > 1) {
                imageDisplay = `
                    <img src="${post.images[0]}" alt="${post.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';">
                    <div class="badge-image-count">📸 ${post.images.length}</div>
                `;
            } else if (post.image) {
                imageDisplay = `<img src="${post.image}" alt="${post.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';">`;
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

        console.log('✅ Posts rendered successfully!');
    }

    showError(message) {
        const grid = document.getElementById('gridBlogPosts');
        grid.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: #e74c3c;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="blog.loadPosts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Try Again
                </button>
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

    // Set modal content
    document.getElementById('titleModal').textContent = post.title;
    document.getElementById('dateModal').textContent = post.date;
    
    // Format content
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
    blog = new GitHubBlog();
});


