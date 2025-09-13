function updateOpeningHours() {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute;
            
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = days[dayOfWeek];
            
            const dayElement = document.getElementById('current-day');
            const hoursElement = document.getElementById('current-hours');
            const statusDot = document.getElementById('status-dot');
            
            if (dayElement && hoursElement && statusDot) {
                dayElement.textContent = currentDayName;
                
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
                
                hoursElement.textContent = hours;
                
                // Update status indicator
                if (isOpen) {
                    statusDot.className = 'status-dot open';
                } else {
                    statusDot.className = 'status-dot closed';
                }
            }
        }
        
        // Mobile menu functionality
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        const servicesToggle = document.querySelector('.services-toggle');
        const servicesDropdown = servicesToggle?.parentElement;

        if (hamburger && navMenu && mobileOverlay) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            mobileOverlay.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Mobile dropdown toggle
        if (servicesToggle) {
            servicesToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 940) {
                    e.preventDefault();
                    servicesDropdown.classList.toggle('dropdown-active');
                }
            });
        }

        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 940) {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
                if (mobileOverlay) mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (servicesDropdown) servicesDropdown.classList.remove('dropdown-active');
            }
        });
        
        // Update on page load
        updateOpeningHours();
        
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