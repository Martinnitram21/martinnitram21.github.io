document.addEventListener('DOMContentLoaded', function () {

    /* ── Theme ────────────────────────────────────────────── */
    var toggle = document.getElementById('themeToggle');
    var saved  = localStorage.getItem('theme');
    if (saved) {
        document.body.setAttribute('data-theme', saved);
        toggle.textContent = saved === 'dark' ? '☀️' : '🌙';
    }
    toggle.addEventListener('click', function () {
        var dark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', dark ? 'light' : 'dark');
        toggle.textContent = dark ? '🌙' : '☀️';
        localStorage.setItem('theme', dark ? 'light' : 'dark');
    });

    /* ── Back to Top ──────────────────────────────────────── */
    var topBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        topBtn.classList.toggle('show', window.scrollY > 300);
    });

    /* ── Typewriter ───────────────────────────────────────── */
    var el = document.getElementById('typed-text');
    if (el) {
        var words    = [
            'Web & Software Developer',
            'Laravel 12 · React · .NET 10',
            'Civil Service Exam Passer · 2026',
            'Building real systems, in 3rd year.'
        ];
        var wi = 0, ci = 0, deleting = false;

        (function tick() {
            var word = words[wi];
            el.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
            ci += deleting ? -1 : 1;

            var wait = deleting ? 45 : 95;
            if (!deleting && ci === word.length)  { wait = 2200; deleting = true; }
            else if (deleting && ci === 0)         { deleting = false; wi = (wi + 1) % words.length; wait = 350; }

            setTimeout(tick, wait);
        })();
    }

    /* ── Active Nav on Scroll ─────────────────────────────── */
    if ('IntersectionObserver' in window) {
        var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        var navObs   = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    navLinks.forEach(function (a) {
                        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
                    });
                }
            });
        }, { threshold: 0.35, rootMargin: '-80px 0px -80px 0px' });
        document.querySelectorAll('section[id]').forEach(function (s) { navObs.observe(s); });
    }

    /* ── Carousels ────────────────────────────────────────── */
    var states = {};
    var timers = {};

    function initCarousel(id) {
        var wrap   = document.getElementById('carousel-' + id);
        if (!wrap) return;
        var slides = wrap.querySelectorAll('.carousel-slide');
        if (!slides.length) return;

        states[id] = { n: slides.length, i: 0 };

        var dotsEl = document.getElementById('indicators-' + id);
        if (dotsEl) {
            slides.forEach(function (_, idx) {
                var d = document.createElement('div');
                d.className = 'indicator' + (idx === 0 ? ' active' : '');
                d.addEventListener('click', function () { jump(id, idx); });
                dotsEl.appendChild(d);
            });
        }

        if (slides.length > 1) {
            timers[id] = setInterval(function () { step(id, 1); }, 4000);
        }
    }

    function step(id, dir) {
        var s = states[id];
        if (!s) return;
        s.i = (s.i + dir + s.n) % s.n;
        draw(id);
        resetTimer(id);
    }

    function jump(id, idx) {
        var s = states[id];
        if (!s) return;
        s.i = idx;
        draw(id);
        resetTimer(id);
    }

    function draw(id) {
        var s    = states[id];
        var wrap = document.getElementById('carousel-' + id);
        if (!wrap || !s) return;
        wrap.style.transform = 'translateX(-' + (s.i * 100) + '%)';
        var dotsEl = document.getElementById('indicators-' + id);
        if (dotsEl) {
            dotsEl.querySelectorAll('.indicator').forEach(function (d, i) {
                d.classList.toggle('active', i === s.i);
            });
        }
    }

    function resetTimer(id) {
        if (!timers[id]) return;
        clearInterval(timers[id]);
        var s = states[id];
        if (s && s.n > 1) {
            timers[id] = setInterval(function () { step(id, 1); }, 4000);
        }
    }

    ['azabuild', 'eskolar', 'travelweave'].forEach(initCarousel);

    /* must be on window so HTML onclick="moveCarousel(...)" can reach it */
    window.moveCarousel = step;

    /* ── ScrollReveal ─────────────────────────────────────── */
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.section',     { distance: '30px', origin: 'bottom', duration: 800, delay: 100, easing: 'ease', reset: false });
        ScrollReveal().reveal('.skill-tag',   { distance: '20px', origin: 'bottom', duration: 600, delay: 50,  interval: 50,   reset: false });
        ScrollReveal().reveal('.project-card',{ distance: '30px', origin: 'bottom', duration: 700, delay: 100, interval: 100,  reset: false });
    }

});