// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollHeader();
    initParticles();
    initPlanModal();
    initSmoothScroll();
    initPageAnimations();
    initLazyAnimations();
    
    // Make sure all external links open in new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// Page Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Show page function
    function showPage(pageId) {
        // Hide all pages first
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            // If page doesn't exist, show home page
            const homePage = document.getElementById('home');
            if (homePage) {
                homePage.classList.add('active');
                pageId = 'home';
            }
        }
        
        // Update active state on navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
        // Update URL hash without triggering scroll
        if (window.location.hash !== `#${pageId}`) {
            history.pushState(null, null, `#${pageId}`);
        }
    }
    
    // Nav link click events
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
                // Scroll to top when changing pages
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
    
    // Handle URL hash on page load
    function handleHash() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('page')) {
            showPage(hash);
        } else {
            showPage('home');
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handleHash);
    
    // Also listen for hash changes directly
    window.addEventListener('hashchange', handleHash);
    
    // Initial page load
    handleHash();
}

// Header scroll effect
function initScrollHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    
    // Set initial state
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Create floating particles
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Clear any existing particles
    particlesContainer.innerHTML = '';
    
    // Create particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 20-100px
        const size = Math.random() * 80 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.1 + 0.03;
        
        // Random animation
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        
        // Random gradient
        const hue = 210 + Math.random() * 30; // Blue color range
        const saturation = 70 + Math.random() * 30;
        particle.style.background = `radial-gradient(circle at 30% 30%, 
            hsla(${hue}, ${saturation}%, 70%, 0.4) 0%, 
            transparent 70%)`;
        
        // Random blur effect
        particle.style.filter = `blur(${Math.random() * 3}px)`;
        
        particlesContainer.appendChild(particle);
    }
}

// Plan Selection Modal
function initPlanModal() {
    const planModal = document.getElementById('planModal');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const selectedPlanInfo = document.getElementById('selectedPlanInfo');
    
    if (!planModal || !closeModal || !closeModalBtn || !selectedPlanInfo) return;
    
    // Handle plan selection buttons
    document.querySelectorAll('.select-plan').forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            const period = this.getAttribute('data-period') || '/month';
            
            let planInfo = '';
            if (price === "0" || price === "0.00") {
                planInfo = `
                    <div class="plan-details">
                        <h3>${plan}</h3>
                        <div class="plan-price-free">FREE</div>
                        <p class="plan-description">This is a 7-day free trial with limited features.</p>
                        <div class="plan-features-list">
                            <p><i class="fas fa-check"></i> Basic features access</p>
                            <p><i class="fas fa-check"></i> 7-day trial period</p>
                            <p><i class="fas fa-check"></i> Email support</p>
                        </div>
                    </div>
                `;
            } else {
                planInfo = `
                    <div class="plan-details">
                        <h3>${plan}</h3>
                        <div class="plan-price">$${price}<span class="plan-period">${period}</span></div>
                        <p class="plan-description">To purchase this plan, please visit our official website.</p>
                        <div class="plan-features-list">
                            <p><i class="fas fa-check"></i> Full features access</p>
                            <p><i class="fas fa-check"></i> Priority support</p>
                            <p><i class="fas fa-check"></i> Regular updates</p>
                        </div>
                    </div>
                `;
            }
            
            selectedPlanInfo.innerHTML = planInfo;
            planModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });
    
    // Function to close modal
    function closeModalFunc() {
        planModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Close modal buttons
    closeModal.addEventListener('click', closeModalFunc);
    closeModalBtn.addEventListener('click', closeModalFunc);
    
    // Close modal when clicking outside
    planModal.addEventListener('click', function(e) {
        if (e.target === planModal) {
            closeModalFunc();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && planModal.style.display === 'flex') {
            closeModalFunc();
        }
    });
}

// Smooth scroll for anchor links within pages
function initSmoothScroll() {
    // Only target anchor links that are NOT page navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetId = href.substring(1);
            
            // Skip if this is a page navigation link
            if (this.classList.contains('nav-link') && this.getAttribute('data-page')) {
                return;
            }
            
            const targetElement = document.getElementById(targetId);
            const currentPage = document.querySelector('.page.active');
            
            // Only scroll if target is within current active page
            if (targetElement && currentPage && currentPage.contains(targetElement)) {
                e.preventDefault();
                
                const header = document.getElementById('mainHeader');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Page animations
function initPageAnimations() {
    // Add animation to pricing cards on page load
    setTimeout(() => {
        document.querySelectorAll('.pricing-card').forEach((card, index) => {
            if (!card.classList.contains('animated')) {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
                card.classList.add('animated');
            }
        });
    }, 300);
    
    // Add animation to feature cards
    setTimeout(() => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            if (!card.classList.contains('animated')) {
                card.style.animationDelay = `${index * 0.15}s`;
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
                card.classList.add('animated');
            }
        });
    }, 500);
    
    // Add CSS animations if not already present
    if (!document.getElementById('custom-animations')) {
        const style = document.createElement('style');
        style.id = 'custom-animations';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            .animated {
                animation-fill-mode: both;
            }
            
            .plan-details {
                text-align: center;
            }
            
            .plan-details h3 {
                color: #3399ff;
                font-size: 24px;
                margin-bottom: 10px;
            }
            
            .plan-price-free {
                font-size: 48px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            
            .plan-price {
                font-size: 48px;
                font-weight: bold;
                color: #ffffff;
                margin: 20px 0;
            }
            
            .plan-period {
                font-size: 18px;
                color: #cccccc;
                margin-left: 5px;
            }
            
            .plan-description {
                color: #cccccc;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .plan-features-list {
                text-align: left;
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            
            .plan-features-list p {
                margin: 10px 0;
                color: #ffffff;
                display: flex;
                align-items: center;
            }
            
            .plan-features-list i {
                color: #4CAF50;
                margin-right: 10px;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Return true if element is within viewport (with some threshold)
    return (
        rect.top <= windowHeight * 0.85 && // 85% from top
        rect.bottom >= windowHeight * 0.15  // 15% from bottom
    );
}

// Lazy load animations when elements come into view
function initLazyAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .contact-form, .contact-info');
    
    function checkElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                // Different animations based on element type
                if (element.classList.contains('pricing-card')) {
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
                } else if (element.classList.contains('feature-card')) {
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    element.style.animation = 'fadeIn 0.8s ease forwards';
                }
            }
        });
    }
    
    // Check on load
    window.addEventListener('load', checkElements);
    
    // Check on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                checkElements();
            }, 100);
        }
    });
    
    // Initial check
    setTimeout(checkElements, 500);
}

// Handle window resize for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Recreate particles on resize for better positioning
        initParticles();
        
        // Re-check animations
        initLazyAnimations();
    }, 250);
});