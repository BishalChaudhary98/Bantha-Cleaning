
// GitHub Configuration
const GITHUB_CONFIG = {
    owner: 'your-username',           // Replace with your GitHub username
    repo: 'your-repo-name',          // Replace with your repository name
    token: 'your-github-token',      // Replace with your personal access token
    branch: 'main'                   // or 'master' depending on your default branch
};

// GitHub API Helper
class GitHubAPI {
    constructor(config) {
        this.config = config;
        this.baseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents`;
    }

    async getFile(path) {
        try {
            const response = await fetch(`${this.baseUrl}/${path}`, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404) {
                return null; // File doesn't exist
            }
            
            const data = await response.json();
            const content = atob(data.content); // Decode base64
            return {
                content: JSON.parse(content),
                sha: data.sha
            };
        } catch (error) {
            console.error('Error fetching file:', error);
            return null;
        }
    }

    async updateFile(path, content, sha = null) {
        try {
            const body = {
                message: `Update ${path}`,
                content: btoa(JSON.stringify(content, null, 2)), // Encode to base64
                branch: this.config.branch
            };

            if (sha) {
                body.sha = sha; // Required for updates
            }

            const response = await fetch(`${this.baseUrl}/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            return response.ok;
        } catch (error) {
            console.error('Error updating file:', error);
            return false;
        }
    }
}

// GitHub Blog System
class GitHubBlog {
    constructor() {
        this.api = new GitHubAPI(GITHUB_CONFIG);
        this.posts = [];
        this.loadPosts();
    }

    async loadPosts() {
        try {
            // Show loading state
            const grid = document.getElementById('gridBlogPosts');
            grid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: #64748b;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                    <h3>Loading posts...</h3>
                </div>
            `;

            // Try to get posts index
            const postsData = await this.api.getFile('posts/posts.json');
            
            if (postsData && postsData.content) {
                this.posts = postsData.content;
            } else {
                this.posts = [];
            }

            this.render();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('Failed to load posts. Please check your internet connection.');
        }
    }

    render() {
        const grid = document.getElementById('gridBlogPosts');
        
        if (this.posts.length === 0) {
            grid.innerHTML = `
                <div class="state-empty">
                    <h3>No posts yet</h3>
                    <p>Posts will appear here once they're published!</p>
                </div>
            `;
            return;
        }

        // Sort posts by date (newest first)
        const sortedPosts = [...this.posts].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        grid.innerHTML = sortedPosts.map(post => {
            let imageDisplay;
            if (post.images && post.images.length > 1) {
                imageDisplay = `
                    <img src="${post.images[0]}" alt="${post.title}">
                    <div class="badge-image-count">📸 ${post.images.length}</div>
                `;
            } else {
                imageDisplay = post.image ? 
                    `<img src="${post.image}" alt="${post.title}">` : 
                    `<span>📝 ${post.title}</span>`;
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

// Image gallery functions (same as before)
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

// Refresh posts every 30 seconds to check for new posts
setInterval(() => {
    if (blog) {
        blog.loadPosts();
    }
}, 30000);
