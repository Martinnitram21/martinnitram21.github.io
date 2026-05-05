// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let isDark = false;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    isDark = true;
}

themeToggle.addEventListener('click', () => {
    if (isDark) {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        isDark = false;
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        isDark = true;
    }
});

// ScrollReveal Initialization (guarded if CDN not available)
if (window.ScrollReveal) {
    window.ScrollReveal().reveal('.section', {
        delay: 200,
        distance: '50px',
        duration: 1000,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 200
    });
} else {
    console.warn('ScrollReveal not loaded; skipping section reveal animations.');
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Add hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Add parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add active state for social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function (e) {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Back to Top visibility and click behavior
const backToTop = document.getElementById('backToTop');
const showAfter = 400;

function updateBackToTopVisibility() {
    if (window.scrollY > showAfter) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
window.addEventListener('load', updateBackToTopVisibility);

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Carousel Functionality
(function setupCarousel() {
    let initialized = false;
    function initCarousel() {
        if (initialized) return;
        const container = document.getElementById('carouselContainer');
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        const indicatorsContainer = document.getElementById('carouselIndicators');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');

        if (!container || totalSlides === 0) return;
        initialized = true;

        // State
        let currentSlide = 0;
        let isAnimating = false;
        let autoTimer = null;

        // Create indicators
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator' + (i === 0 ? ' active' : '');
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }

        function updateCarousel() {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            const allIndicators = document.querySelectorAll('.indicator');
            allIndicators.forEach((ind, index) => {
                ind.classList.toggle('active', index === currentSlide);
            });
        }

        function moveCarousel(direction) {
            if (isAnimating) return;
            isAnimating = true;
            currentSlide += direction;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            updateCarousel();
            // debounce: allow next click after transition ends
            setTimeout(() => { isAnimating = false; }, 650);
            // pause auto-advance briefly after user action
            resetAutoAdvance();
        }

        function goToSlide(index) {
            if (isAnimating) return;
            isAnimating = true;
            currentSlide = index;
            updateCarousel();
            setTimeout(() => { isAnimating = false; }, 650);
            resetAutoAdvance();
        }

        // Bind listeners
        if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));

        // Auto-advance
        function startAutoAdvance() {
            stopAutoAdvance();
            autoTimer = setInterval(() => {
                if (!isAnimating) moveCarousel(1);
            }, 5000);
        }

        function stopAutoAdvance() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        function resetAutoAdvance() {
            stopAutoAdvance();
            setTimeout(startAutoAdvance, 3000);
        }

        // Expose for inline handlers
        window.moveCarousel = moveCarousel;
        window.goToSlide = goToSlide;

        // Initial position
        updateCarousel();
        startAutoAdvance();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initCarousel();
    } else {
        window.addEventListener('DOMContentLoaded', initCarousel);
    }
})();