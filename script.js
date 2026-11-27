// =========================================================
// Portfolio — Babacar Djitte
// =========================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Menu mobile =====
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const setMenu = open => {
  if (!toggle || !links) return;
  links.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
};
if (toggle && links) {
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });
}

// ===== Barre de nav + barre de progression =====
const nav = document.querySelector(".nav");
const progress = document.querySelector(".progress");
const onScroll = () => {
  const y = window.scrollY;
  nav && nav.classList.toggle("scrolled", y > 10);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== « Haut de page » =====
document.querySelectorAll("[data-top]").forEach(a =>
  a.addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); })
);

// ===== Effet machine à écrire (accueil) =====
const typed = document.querySelector(".typed");
if (typed && !reduceMotion) {
  const words = JSON.parse(typed.dataset.words);
  let w = 0, i = words[0].length, deleting = true;
  const tick = () => {
    const word = words[w];
    i += deleting ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 40 : 85;
    if (!deleting && i === word.length) { deleting = true; delay = 2000; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2400);
}

// ===== Compteurs =====
const animateCount = el => {
  const target = +el.dataset.count;
  if (reduceMotion || target < 2) { el.textContent = target; return; }
  let n = 0;
  el.textContent = "0";
  const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 600 / target); };
  setTimeout(step, 200);
};

// ===== Apparition au défilement =====
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

// ===== Filtre des projets =====
const filterBtns = document.querySelectorAll(".filters button");
filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project").forEach(p => {
      const hide = f !== "all" && p.dataset.cat !== f;
      p.classList.toggle("hidden", hide);
      if (!hide) p.classList.add("visible");
    });
  })
);

// ===== Transition douce entre les pages =====
if (!reduceMotion) {
  document.querySelectorAll("a[href$='.html']").forEach(a => {
    a.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
      const url = a.getAttribute("href");
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.href = url; }, 230);
    });
  });
  // Retour arrière depuis le cache du navigateur : réafficher la page
  window.addEventListener("pageshow", e => { if (e.persisted) document.body.classList.remove("leaving"); });
}

// ===== Années automatiques =====
const year = new Date().getFullYear();
document.querySelectorAll("#year, #cover-year").forEach(el => { el.textContent = year; });
