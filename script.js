// =========================================================
// Shiven Rastogi — portfolio interactivity
// theme · scroll-spy · reveal · email copy · keyboard nav
// =========================================================

(function () {
  const root = document.documentElement;
  const THEME_KEY = "shiven.theme";

  // ---- theme (inline <head> script already set data-theme; this is the toggle wiring) ----

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // ---- mobile nav (hamburger) ----
  const navToggle = document.getElementById("navToggle");
  const topnav = document.querySelector(".topnav");
  const closeNav = () => {
    if (!topnav || !navToggle) return;
    topnav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  if (navToggle && topnav) {
    navToggle.addEventListener("click", () => {
      const isOpen = topnav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    topnav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 600) closeNav();
    });
  }

  // ---- topbar shadow on scroll ----
  const topbar = document.querySelector(".topbar");
  const onScroll = () => {
    if (!topbar) return;
    topbar.classList.toggle("scrolled", window.scrollY > 6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- scroll-spy (home page only, in-page sections) ----
  const page = document.body.dataset.page;
  if (page === "home") {
    const map = {
      work: "work",
      stack: "stack",
    };
    const navLinks = Array.from(document.querySelectorAll(".topnav a[data-nav]"));
    const sections = Object.entries(map)
      .map(([key, id]) => ({ key, el: document.getElementById(id) }))
      .filter((s) => s.el);

    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const key = Object.keys(map).find((k) => map[k] === e.target.id);
            navLinks.forEach((a) => {
              if (a.dataset.nav === key) a.classList.add("active");
              else if (["work", "stack"].includes(a.dataset.nav)) a.classList.remove("active");
            });
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      sections.forEach((s) => spy.observe(s.el));
    }
  }

  // ---- reveal on scroll (skip animation for already-visible sections so hash nav feels instant) ----
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const vh = window.innerHeight;
    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("in");
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => { if (!el.classList.contains("in")) io.observe(el); });
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ---- email copy ----
  const toast = document.getElementById("toast");
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  const emailBtn = document.getElementById("emailBtn");
  if (emailBtn && navigator.clipboard) {
    emailBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText("rastogishiven7@gmail.com");
        showToast("Email copied ✓");
      } catch {
        window.location.href = "mailto:rastogishiven7@gmail.com";
      }
    });
  }

  // ---- résumé modal (PDF preview + download) ----
  const RESUME_URL = "Resume%26Certificates/Shiven__Resume.pdf";
  let modal = null;

  function buildModal() {
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Résumé preview");
    wrap.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <div class="modal-title">
            <span class="pdf-pill">PDF</span>
            <span>Shiven Rastogi — Résumé</span>
          </div>
          <div class="modal-actions">
            <a class="btn primary" href="${RESUME_URL}" download="Shiven_Rastogi_Resume.pdf">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span class="hide-sm">Download</span>
            </a>
            <a class="btn ghost" href="${RESUME_URL}" target="_blank" rel="noopener" aria-label="Open in new tab" title="Open in new tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <button class="modal-close" aria-label="Close preview" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="modal-body">
          <iframe src="${RESUME_URL}#toolbar=1&navpanes=0&view=FitH" title="Résumé preview" loading="lazy"></iframe>
          <div class="modal-fallback">
            <div>Your browser couldn't render the preview.</div>
            <a class="btn primary" href="${RESUME_URL}" download>↓ Download résumé</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    // close interactions
    wrap.addEventListener("click", (ev) => {
      if (ev.target === wrap) closeModal();
    });
    wrap.querySelector(".modal-close").addEventListener("click", closeModal);

    // iframe fallback if PDF won't render
    const iframe = wrap.querySelector("iframe");
    const fallback = wrap.querySelector(".modal-fallback");
    iframe.addEventListener("error", () => {
      iframe.style.display = "none";
      fallback.style.display = "flex";
    });

    return wrap;
  }

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) modal = buildModal();
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll("[data-resume]").forEach((el) => {
    el.addEventListener("click", openModal);
  });

  // ---- footer year ----
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ---- keyboard: Shift+T toggles theme ----
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (!t) return;
    const tag = t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
    if (e.shiftKey && (e.key === "T" || e.key === "t") && !e.metaKey && !e.ctrlKey && !e.altKey) {
      toggle && toggle.click();
    }
    if (e.key === "Escape") { closeModal(); closeNav(); }
  });
})();
