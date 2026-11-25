// ===== Menu mobile =====
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const setMenu = open => {
  links.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
};
if (toggle && links) {
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 860) setMenu(false); });
}

// ===== Bordure de la barre de nav au défilement =====
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

// ===== Effet machine à écrire (page d'accueil) =====
const typed = document.querySelector(".typed");
if (typed) {
  const words = JSON.parse(typed.dataset.words);
  let w = 0, i = words[0].length, deleting = true;
  const tick = () => {
    const word = words[w];
    i += deleting ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;
    if (!deleting && i === word.length) { deleting = true; delay = 1800; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 1800);
}

// ===== Compteurs animés =====
const animateCount = el => {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => {
    n++;
    el.textContent = n;
    if (n < target) setTimeout(step, 1000 / target);
  };
  step();
};

// ===== Apparition des sections =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-count]").forEach(el => {
      if (!el.dataset.done) { el.dataset.done = 1; animateCount(el); }
    });
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ===== Filtre des projets (page Projets) =====
const filterBtns = document.querySelectorAll(".filters button");
filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project").forEach(p =>
      p.classList.toggle("hidden", f !== "all" && p.dataset.cat !== f)
    );
  })
);

// ===== Année du footer =====
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
const coverYear = document.getElementById("cover-year");
if (coverYear) coverYear.textContent = new Date().getFullYear();
