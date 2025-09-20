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