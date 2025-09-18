// Store current post data for gallery navigation
        let currentPost = null;

        // Simple blog system
        class SimpleBlog {
            constructor() {
                this.posts = this.loadPosts();
                this.render();
            }

            // Load posts from localStorage
            loadPosts() {
                const saved = localStorage.getItem('blogPosts');
                return saved ? JSON.parse(saved) : [];
            }

            // Render all posts
            render() {
                const grid = document.getElementById('blogGrid');
                
                if (this.posts.length === 0) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <h3>No posts yet</h3>
                            <p>Click "Add New Post" to create your first blog post!</p>
                        </div>
                    `;
                    return;
                }

                grid.innerHTML = this.posts.map(post => {
                    // Handle multiple images
                    let imageDisplay;
                    if (post.images && post.images.length > 1) {
                        imageDisplay = `
                            <img src="${post.images[0]}" alt="${post.title}">
                            <div class="image-count">📸 ${post.images.length}</div>
                        `;
                    } else {
                        imageDisplay = post.image ? 
                            `<img src="${post.image}" alt="${post.title}">` : 
                            `<span>📝 ${post.title}</span>`;
                    }

                    return `
                        <div class="blog-card" onclick="showFullPost(${post.id})">
                            <div class="blog-image">
                                ${imageDisplay}
                            </div>
                            <div class="blog-content">
                                <div class="blog-date">${post.date}</div>
                                <h3 class="blog-title">${post.title}</h3>
                                <p class="blog-excerpt">${post.excerpt}</p>
                                <span class="read-more">Read More →</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            // Refresh posts (for real-time updates)
            refresh() {
                this.posts = this.loadPosts();
                this.render();
            }
        }

        // Show full post in modal (FIXED VERSION)
        function showFullPost(postId) {
            const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const post = posts.find(p => p.id === postId);
            
            if (!post) return;

            // Store current post for gallery navigation
            currentPost = post;

            // Set modal content
            document.getElementById('modalTitle').textContent = post.title;
                        document.getElementById('modalDate').textContent = post.date;
            
            // FIXED: Better content formatting with proper paragraph breaks
            let formattedContent = post.content;
            
            // First, normalize line endings
            formattedContent = formattedContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            
            // Split content into paragraphs based on double line breaks
            let paragraphs = formattedContent.split(/\n\s*\n/);
            
            // If no double line breaks found, split on single line breaks
            if (paragraphs.length === 1) {
                paragraphs = formattedContent.split('\n');
            }
            
            // Format each paragraph
            formattedContent = paragraphs
                .map(paragraph => paragraph.trim())
                .filter(paragraph => paragraph.length > 0)
                .map(paragraph => {
                    // Handle single line breaks within paragraphs as <br>
                    const formattedParagraph = paragraph.replace(/\n/g, '<br>');
                    return `<p>${formattedParagraph}</p>`;
                })
                .join('');
            
            document.getElementById('modalContent').innerHTML = formattedContent;

            // Handle images
            showImageGallery();

            // Show modal
            document.getElementById('postModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Show image gallery (separated for reuse)
        function showImageGallery() {
            const modalImages = document.getElementById('modalImages');
            
            if (currentPost.images && currentPost.images.length > 0) {
                if (currentPost.images.length === 1) {
                    // Single image - full width
                    modalImages.innerHTML = `<img src="${currentPost.images[0]}" alt="${currentPost.title}">`;
                } else {
                    // Multiple images - grid layout
                    modalImages.innerHTML = `
                        <div class="modal-images-grid">
                            ${currentPost.images.map(img => `<img src="${img}" alt="${currentPost.title}" onclick="showLargeImage('${img}')">`).join('')}
                        </div>
                    `;
                }
            } else if (currentPost.image) {
                // Fallback single image
                modalImages.innerHTML = `<img src="${currentPost.image}" alt="${currentPost.title}">`;
            } else {
                // No images
                modalImages.innerHTML = `
                    <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        📝 ${currentPost.title}
                    </div>
                `;
            }
        }

        // Show large image (FIXED - now goes back to gallery, not blog)
        function showLargeImage(imageSrc) {
            const modalImages = document.getElementById('modalImages');
            modalImages.innerHTML = `
                <img src="${imageSrc}" alt="Large view">
                <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;" onclick="showImageGallery()">
                    ← Back to Gallery
                </div>
            `;
        }

        // Close modal
        function closeModal() {
            document.getElementById('postModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            currentPost = null; // Clear current post
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('postModal');
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Initialize blog
        const blog = new SimpleBlog();

        // Refresh when new posts are added (for real-time updates)
        window.addEventListener('storage', function(e) {
            if (e.key === 'blogPosts') {
                blog.refresh();
            }
        });

        // Also refresh when page gets focus (when returning from add-post page)
        window.addEventListener('focus', function() {
            blog.refresh();
        });

        // Refresh every 5 seconds to catch new posts
        setInterval(() => {
            blog.refresh();
        }, 5000);