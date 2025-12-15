/* ==========================================================================
   ImImprint - Handmade Folding Camping Chair
   Custom JavaScript
   ========================================================================== */

(function() {
    'use strict';

    /* --------------------------------------------------------------------------
       DOM Elements
       -------------------------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const currentYearSpan = document.getElementById('current-year');
    const revealElements = document.querySelectorAll('.feature-item, .spec-item, .gallery-item, .story-content, .features-image-wrapper, .specs-image-wrapper');

    /* --------------------------------------------------------------------------
       Gallery Images Array
       -------------------------------------------------------------------------- */
    const galleryImages = [
        {
            src: 'img/imprint-chair-modern-handcrafted-oak-leather-lounge-chair.jpg',
            alt: 'Modern handcrafted oak and leather lounge chair'
        },
        {
            src: 'img/indoor-outdoor-folding-chair-handcrafted-imprint_chair.jpg',
            alt: 'Indoor outdoor folding chair handcrafted'
        },
        {
            src: 'img/handmade-folding-camp-chair-natural-wood-imprint_chair.jpg',
            alt: 'Handmade folding camp chair with natural wood'
        },
        {
            src: 'img/artisan-handmade-folding-chair-legacy-design-earthy-leather-imprint_chair.jpg',
            alt: 'Artisan handmade folding chair with legacy design'
        }
    ];

    let currentImageIndex = 0;

    /* --------------------------------------------------------------------------
       Navbar Scroll Effect
       -------------------------------------------------------------------------- */
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /* --------------------------------------------------------------------------
       Lightbox Functions
       -------------------------------------------------------------------------- */
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const image = galleryImages[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function handleKeydown(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    /* --------------------------------------------------------------------------
       Scroll Reveal Animation
       -------------------------------------------------------------------------- */
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }

    /* --------------------------------------------------------------------------
       Smooth Scroll for Navigation Links
       -------------------------------------------------------------------------- */
    function handleNavClick(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        }
    }

    /* --------------------------------------------------------------------------
       Set Current Year in Footer
       -------------------------------------------------------------------------- */
    function setCurrentYear() {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    /* --------------------------------------------------------------------------
       Initialize Reveal Classes
       -------------------------------------------------------------------------- */
    function initRevealElements() {
        revealElements.forEach(element => {
            element.classList.add('reveal');
        });
    }

    /* --------------------------------------------------------------------------
       Event Listeners
       -------------------------------------------------------------------------- */
    function initEventListeners() {
        // Navbar scroll
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
        
        // Scroll reveal
        window.addEventListener('scroll', revealOnScroll, { passive: true });
        
        // Gallery lightbox
        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                openLightbox(index);
            });
        });
        
        // Lightbox controls
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }
        
        // Close lightbox on backdrop click
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link, a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
    }

    /* --------------------------------------------------------------------------
       Touch/Swipe Support for Lightbox
       -------------------------------------------------------------------------- */
    function initTouchSupport() {
        if (!lightbox) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - show next
                    showNextImage();
                } else {
                    // Swiped right - show previous
                    showPrevImage();
                }
            }
        }
    }

    /* --------------------------------------------------------------------------
       Parallax Effect for Hero Image (subtle)
       -------------------------------------------------------------------------- */
    function initParallax() {
        const heroImage = document.querySelector('.hero-image');
        
        if (!heroImage || window.innerWidth < 992) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.3;
            
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, { passive: true });
    }

    /* --------------------------------------------------------------------------
       Preload Gallery Images
       -------------------------------------------------------------------------- */
    function preloadImages() {
        galleryImages.forEach(image => {
            const img = new Image();
            img.src = image.src;
        });
    }

    /* --------------------------------------------------------------------------
       Initialize
       -------------------------------------------------------------------------- */
    function init() {
        setCurrentYear();
        initRevealElements();
        initEventListeners();
        initTouchSupport();
        initParallax();
        
        // Initial check for scroll position
        handleNavbarScroll();
        
        // Initial reveal check
        setTimeout(revealOnScroll, 100);
        
        // Preload images after page load
        window.addEventListener('load', preloadImages);
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

