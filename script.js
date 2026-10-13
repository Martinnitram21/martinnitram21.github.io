(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.addEventListener("DOMContentLoaded", function () {
    /* ── Theme ──────────────────────────────────────────── */
    var toggle = document.getElementById("themeToggle");

    function applyTheme(theme) {
      document.body.setAttribute("data-theme", theme);
      toggle.firstElementChild.textContent = theme === "dark" ? "☀️" : "🌙";
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }

    var saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {
      /* storage unavailable — fall back to system preference */
    }

    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(saved || (prefersDark ? "dark" : "light"));

    toggle.addEventListener("click", function () {
      var next =
        document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* ignore */
      }
    });

    /* ── Mobile nav ─────────────────────────────────────── */
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });

      navLinks.addEventListener("click", function (e) {
        if (e.target.classList.contains("nav-link")) {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* ── Footer year ────────────────────────────────────── */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Back to top ────────────────────────────────────── */
    var topBtn = document.getElementById("backToTop");
    var ticking = false;

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          topBtn.classList.toggle("show", window.scrollY > 320);
          ticking = false;
        });
      },
      { passive: true },
    );

    /* ── Typewriter ─────────────────────────────────────── */
    var typedEl = document.getElementById("typed-text");
    var words = [
      "Full-stack developer",
      "Laravel · React · .NET 10 · Alpine.js",
      "Civil Service Professional passer",
      "2× COIL International team lead",
      "Shipping software people actually use",
    ];

    if (typedEl && reduceMotion) {
      typedEl.textContent = words[0];
    } else if (typedEl) {
      var wi = 0;
      var ci = 0;
      var deleting = false;

      (function tick() {
        var word = words[wi];
        typedEl.textContent = deleting
          ? word.slice(0, ci - 1)
          : word.slice(0, ci + 1);
        ci += deleting ? -1 : 1;

        var wait = deleting ? 45 : 95;
        if (!deleting && ci === word.length) {
          wait = 2200;
          deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          wait = 350;
        }
        setTimeout(tick, wait);
      })();
    }

    /* ── Active nav link on scroll ──────────────────────── */
    if ("IntersectionObserver" in window) {
      var links = document.querySelectorAll('.nav-link[href^="#"]');
      var navObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (a) {
              a.classList.toggle(
                "active",
                a.getAttribute("href") === "#" + entry.target.id,
              );
            });
          });
        },
        { threshold: 0.35, rootMargin: "-80px 0px -80px 0px" },
      );
      document.querySelectorAll("section[id]").forEach(function (s) {
        navObs.observe(s);
      });
    }

    /* ── Scroll reveal (replaces the ScrollReveal CDN) ──── */
    if ("IntersectionObserver" in window && !reduceMotion) {
      var revealTargets = document.querySelectorAll(
        ".section:not(.hero), .featured-project",
      );
      revealTargets.forEach(function (el) {
        el.classList.add("reveal");
      });

      var revealObs = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
      );

      revealTargets.forEach(function (el) {
        revealObs.observe(el);
      });
    }

    /* ── Carousels ──────────────────────────────────────── */
    var carousels = {};
    var AUTOPLAY_MS = 5000;

    function draw(id) {
      var c = carousels[id];
      if (!c) return;

      c.track.style.transform = "translateX(-" + c.index * 100 + "%)";

      c.slides.forEach(function (slide, i) {
        // Keep off-screen slides out of the tab order and the a11y tree
        slide.setAttribute("aria-hidden", String(i !== c.index));
        slide.querySelectorAll("a, button").forEach(function (el) {
          el.tabIndex = i === c.index ? 0 : -1;
        });
      });

      if (c.dots) {
        c.dots.forEach(function (dot, i) {
          var isActive = i === c.index;
          dot.classList.toggle("active", isActive);
          dot.setAttribute("aria-current", String(isActive));
        });
      }
    }

    function step(id, dir) {
      var c = carousels[id];
      if (!c) return;
      c.index = (c.index + dir + c.count) % c.count;
      draw(id);
      restart(id);
    }

    function jump(id, i) {
      var c = carousels[id];
      if (!c) return;
      c.index = i;
      draw(id);
      restart(id);
    }

    function stop(id) {
      var c = carousels[id];
      if (c && c.timer) {
        clearInterval(c.timer);
        c.timer = null;
      }
    }

    function start(id) {
      var c = carousels[id];
      if (!c || c.count < 2 || c.timer || c.paused || reduceMotion) return;
      c.timer = setInterval(function () {
        c.index = (c.index + 1) % c.count;
        draw(id);
      }, AUTOPLAY_MS);
    }

    function restart(id) {
      stop(id);
      start(id);
    }

    function initCarousel(id) {
      var track = document.getElementById("carousel-" + id);
      if (!track) return;

      var slides = Array.prototype.slice.call(
        track.querySelectorAll(".carousel-slide"),
      );
      if (!slides.length) return;

      var region = track.closest(".project-carousel");
      var dotsWrap = document.getElementById("indicators-" + id);
      var dots = [];

      if (dotsWrap && slides.length > 1) {
        slides.forEach(function (_, i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "indicator" + (i === 0 ? " active" : "");
          dot.setAttribute("aria-label", "Show screenshot " + (i + 1));
          dot.addEventListener("click", function () {
            jump(id, i);
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        });
      }

      carousels[id] = {
        track: track,
        slides: slides,
        dots: dots,
        count: slides.length,
        index: 0,
        timer: null,
        paused: false,
      };

      // Hide the controls entirely when there's nothing to page through
      if (slides.length < 2 && region) {
        region.querySelectorAll(".carousel-btn").forEach(function (b) {
          b.style.display = "none";
        });
      }

      if (region) {
        region.setAttribute("role", "region");
        region.setAttribute("aria-roledescription", "carousel");

        // Pause while the visitor is actually looking at it
        ["mouseenter", "focusin"].forEach(function (evt) {
          region.addEventListener(evt, function () {
            carousels[id].paused = true;
            stop(id);
          });
        });
        ["mouseleave", "focusout"].forEach(function (evt) {
          region.addEventListener(evt, function () {
            carousels[id].paused = false;
            start(id);
          });
        });

        // Arrow-key navigation
        region.addEventListener("keydown", function (e) {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(id, -1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            step(id, 1);
          }
        });

        // Swipe on touch devices
        var startX = null;
        region.addEventListener(
          "touchstart",
          function (e) {
            startX = e.touches[0].clientX;
            stop(id);
          },
          { passive: true },
        );
        region.addEventListener(
          "touchend",
          function (e) {
            if (startX === null) return;
            var delta = e.changedTouches[0].clientX - startX;
            if (Math.abs(delta) > 45) step(id, delta < 0 ? 1 : -1);
            startX = null;
            start(id);
          },
          { passive: true },
        );
      }

      draw(id);
      start(id);
    }

    ["azabuild", "eskolar", "klaru", "travellink", "travelweave"].forEach(initCarousel);

    document.querySelectorAll(".carousel-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        step(btn.dataset.carousel, parseInt(btn.dataset.dir, 10));
      });
    });

    // Stop every autoplay timer while the tab is in the background
    document.addEventListener("visibilitychange", function () {
      Object.keys(carousels).forEach(function (id) {
        if (document.hidden) {
          stop(id);
        } else {
          start(id);
        }
      });
    });

    /* ── Lightbox ───────────────────────────────────────── */
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    var lightboxCap = document.getElementById("lightboxCaption");
    var lightboxClose = document.getElementById("lightboxClose");
    var lastFocused = null;

    function openLightbox(src, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCap.textContent = caption;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
      lightboxImg.alt = "";
      if (lastFocused) lastFocused.focus();
    }

    // If a certificate image is missing, say so instead of showing a broken frame
    lightboxImg.addEventListener("error", function () {
      lightboxCap.textContent =
        "This certificate image isn't available yet. Email me and I'll send a copy.";
    });

    document.querySelectorAll("button.cert-view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastFocused = btn;
        openLightbox(btn.dataset.certSrc, btn.dataset.certCaption);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "Tab") {
        // Only one focusable control in the dialog — keep focus inside it
        e.preventDefault();
        lightboxClose.focus();
      }
    });
  });
})();