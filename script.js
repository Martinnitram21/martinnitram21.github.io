// ── Theme Toggle ──────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
  themeToggle.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("theme", isDark ? "light" : "dark");
});

// ── Back to Top ───────────────────────────────────────────────
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 300);
});

// ── Carousel System (supports multiple instances) ─────────────
const carouselStates = {};
const carouselTimers = {};

function initCarousel(id) {
  const container = document.getElementById("carousel-" + id);
  if (!container) return;

  const slides = container.querySelectorAll(".carousel-slide");
  if (!slides.length) return;

  carouselStates[id] = { current: 0, total: slides.length };

  const indicators = document.getElementById("indicators-" + id);
  if (indicators) {
    indicators.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "indicator" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => goToSlide(id, i));
      indicators.appendChild(dot);
    });
  }

  if (slides.length > 1) {
    carouselTimers[id] = setInterval(() => moveCarousel(1, id), 4000);
  }
}

function moveCarousel(direction, id) {
  const state = carouselStates[id];
  if (!state) return;
  state.current = (state.current + direction + state.total) % state.total;
  updateCarousel(id);
  resetTimer(id);
}

function goToSlide(id, index) {
  if (!carouselStates[id]) return;
  carouselStates[id].current = index;
  updateCarousel(id);
  resetTimer(id);
}

function updateCarousel(id) {
  const state = carouselStates[id];
  const container = document.getElementById("carousel-" + id);
  if (!container) return;

  container.style.transform = `translateX(-${state.current * 100}%)`;

  const indicators = document.getElementById("indicators-" + id);
  if (indicators) {
    indicators.querySelectorAll(".indicator").forEach((dot, i) => {
      dot.classList.toggle("active", i === state.current);
    });
  }
}

function resetTimer(id) {
  if (!carouselTimers[id]) return;
  clearInterval(carouselTimers[id]);
  const state = carouselStates[id];
  if (state && state.total > 1) {
    carouselTimers[id] = setInterval(() => moveCarousel(1, id), 4000);
  }
}

// ── ScrollReveal ──────────────────────────────────────────────
ScrollReveal().reveal(".section", {
  distance: "30px",
  origin: "bottom",
  duration: 800,
  delay: 100,
  easing: "ease",
  reset: false,
});

ScrollReveal().reveal(".skill-tag", {
  distance: "20px",
  origin: "bottom",
  duration: 600,
  delay: 50,
  interval: 50,
  reset: false,
});

ScrollReveal().reveal(".project-card", {
  distance: "30px",
  origin: "bottom",
  duration: 700,
  delay: 100,
  interval: 100,
  reset: false,
});

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  ["azabuild", "eskolar", "travelweave"].forEach(initCarousel);
});
