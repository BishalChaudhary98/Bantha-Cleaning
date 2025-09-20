function updateOpeningHours() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = days[dayOfWeek];
    
    // Desktop elements
    const dayElement = document.getElementById('current-day');
    const hoursElement = document.getElementById('current-hours');
    const statusDot = document.getElementById('status-dot');
    
    // Mobile elements
    const mobileDayElement = document.getElementById('mobile-current-day');
    const mobileHoursElement = document.getElementById('mobile-current-hours');
    const mobileStatusDot = document.getElementById('mobile-status-dot');
    
    let hours, isOpen;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        hours = '10:00 AM - 4:00 PM';
        const openTime = 10 * 60; // 10:00 AM in minutes
        const closeTime = 16 * 60; // 4:00 PM in minutes
        isOpen = currentTime >= openTime && currentTime < closeTime;
    } else { // Monday to Friday
        hours = '8:00 AM - 5:00 PM';
        const openTime = 8 * 60; // 8:00 AM in minutes
        const closeTime = 17 * 60; // 5:00 PM in minutes
        isOpen = currentTime >= openTime && currentTime < closeTime;
    }
    
    // Update desktop elements (if they exist)
    if (dayElement && hoursElement && statusDot) {
        dayElement.textContent = currentDayName;
        hoursElement.textContent = hours;
        
        if (isOpen) {
            statusDot.className = 'status-dot open';
        } else {
            statusDot.className = 'status-dot closed';
        }
    }
    
    // Update mobile elements (if they exist)
    if (mobileDayElement && mobileHoursElement && mobileStatusDot) {
        mobileDayElement.textContent = currentDayName;
        mobileHoursElement.textContent = hours;
        
        if (isOpen) {
            mobileStatusDot.className = 'status-dot open';
        } else {
            mobileStatusDot.className = 'status-dot closed';
        }
    }
}

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const mobileOverlay = document.querySelector('.mobile-overlay');
const servicesToggle = document.querySelector('.services-toggle');
const areasToggle = document.querySelector('.areas-toggle');
const servicesDropdown = servicesToggle?.parentElement;
const areasDropdown = areasToggle?.parentElement;
const mobileOpeningHours = document.querySelector('.mobile-opening-hours'); // ADDED: But made optional

// FIXED: Check if elements exist before adding event listeners
if (hamburger && navMenu && mobileOverlay) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // FIXED: Only handle mobile opening hours if it exists
        if (mobileOpeningHours) {
            if (navMenu.classList.contains('active')) {
                mobileOpeningHours.style.left = '0';
            } else {
                mobileOpeningHours.style.left = '-300px';
            }
        }
        
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        
        // FIXED: Only handle mobile opening hours if it exists
        if (mobileOpeningHours) {
            mobileOpeningHours.style.left = '-300px';
        }
        
        document.body.style.overflow = '';
    });
}

// Mobile dropdown toggles
if (servicesToggle) {
    servicesToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 940) {
            e.preventDefault();
            servicesDropdown.classList.toggle('dropdown-active');
            // Close areas dropdown if open
            if (areasDropdown) areasDropdown.classList.remove('dropdown-active');
        }
    });
}

// Areas dropdown toggle for mobile
if (areasToggle) {
    areasToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 940) {
            e.preventDefault();
            areasDropdown.classList.toggle('dropdown-active');
            // Close services dropdown if open
            if (servicesDropdown) servicesDropdown.classList.remove('dropdown-active');
        }
    });
}

// Close mobile menu when clicking on navigation links
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link') && !e.target.matches('.services-toggle') && !e.target.matches('.areas-toggle')) {
        if (window.innerWidth <= 940) {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            
            // FIXED: Only handle mobile opening hours if it exists
            if (mobileOpeningHours) {
                mobileOpeningHours.style.left = '-300px';
            }
            
            document.body.style.overflow = '';
        }
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 940) {
        // Close services dropdown if clicking outside
        if (servicesDropdown && !servicesDropdown.contains(e.target)) {
            servicesDropdown.classList.remove('dropdown-active');
        }
        
        // Close areas dropdown if clicking outside
        if (areasDropdown && !areasDropdown.contains(e.target)) {
            areasDropdown.classList.remove('dropdown-active');
        }
    }
});

// Dropdown management for better UX
function closeAllDropdowns() {
    if (servicesDropdown) servicesDropdown.classList.remove('dropdown-active');
    if (areasDropdown) areasDropdown.classList.remove('dropdown-active');
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllDropdowns();
        
        // Also close mobile menu if open
        if (window.innerWidth <= 940) {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            
            // FIXED: Only handle mobile opening hours if it exists
            if (mobileOpeningHours) {
                mobileOpeningHours.style.left = '-300px';
            }
            
            document.body.style.overflow = '';
        }
    }
});

// Touch support for mobile dropdowns
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;
    
    // If significant upward swipe, close dropdowns
    if (touchDiff > 50 && window.innerWidth <= 940) {
        closeAllDropdowns();
    }
});

// Performance optimization - debounce resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (window.innerWidth > 940) {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            
            // FIXED: Only handle mobile opening hours if it exists
            if (mobileOpeningHours) {
                mobileOpeningHours.style.left = '-300px';
            }
            
            document.body.style.overflow = '';
            closeAllDropdowns();
        }
    }, 250);
});

// Update on page load
document.addEventListener('DOMContentLoaded', function() {
    updateOpeningHours();
});

// Update every minute
setInterval(updateOpeningHours, 60000);

// Add smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
    });
});

// Optional: Add loading state for opening hours
function showLoadingState() {
    const elements = [
        document.getElementById('current-day'),
        document.getElementById('mobile-current-day')
    ];
    
    elements.forEach(element => {
        if (element) {
            element.textContent = 'Loading...';
        }
    });
}

// Optional: Error handling for opening hours
function handleOpeningHoursError() {
    const elements = [
        { day: document.getElementById('current-day'), hours: document.getElementById('current-hours') },
        { day: document.getElementById('mobile-current-day'), hours: document.getElementById('mobile-current-hours') }
    ];
    
    elements.forEach(set => {
        if (set.day && set.hours) {
            set.day.textContent = 'Today';
            set.hours.textContent = 'Call for hours';
        }
    });
}

// Enhanced opening hours with error handling
function safeUpdateOpeningHours() {
    try {
        updateOpeningHours();
    } catch (error) {
        console.error('Error updating opening hours:', error);
        handleOpeningHoursError();
    }
}

// Use safe update function
document.addEventListener('DOMContentLoaded', function() {
    safeUpdateOpeningHours();
});

setInterval(safeUpdateOpeningHours, 60000);

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