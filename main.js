// Demo video — played inside the page in a modal player.
const VIDEO_ID = "emYTZJXGEjM";
const DEMO_URL = `https://youtu.be/${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;

// Real href so middle-click / "open in new tab" / no-JS still reach YouTube.
document.querySelectorAll("[data-demo-link]").forEach((a) => {
  a.href = DEMO_URL;
  a.target = "_blank";
  a.rel = "noopener";
});

let dlg, frameBox;

function buildPlayer() {
  dlg = document.createElement("dialog");
  dlg.className = "video-dialog";
  dlg.setAttribute("aria-label", "TransitionBridge demo video");
  dlg.innerHTML = `
    <div class="vd-bar">
      <span>Demo video</span>
      <button type="button" class="vd-close" aria-label="Close video">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
    </div>
    <div class="vd-frame"></div>
    <div class="vd-foot">Not loading? <a href="${DEMO_URL}" target="_blank" rel="noopener">Watch on YouTube&nbsp;↗</a></div>`;
  document.body.appendChild(dlg);
  frameBox = dlg.querySelector(".vd-frame");

  dlg.querySelector(".vd-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => {
    frameBox.replaceChildren(); // removing the iframe stops playback
    const otherOpen = document.querySelector("dialog[open]");
    document.documentElement.style.overflow = otherOpen ? "hidden" : "";
  });
}

function openPlayer() {
  if (!dlg) buildPlayer();
  const iframe = document.createElement("iframe");
  iframe.src = EMBED_URL;
  iframe.title = "TransitionBridge demo video";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  frameBox.replaceChildren(iframe);
  dlg.showModal();
  document.documentElement.style.overflow = "hidden";
}

// Delegated so it also works for links cloned into other dialogs.
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-demo-link]");
  if (!link || e.defaultPrevented) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openPlayer();
});

// Page transitions fallback for browsers without cross-document View Transitions:
// fade the page out before following a link to another page of this site.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains("no-vt")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== "_self") return;
    if (a.hasAttribute("data-demo-link") || a.hasAttribute("download")) return;

    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // same page / hash jump

    e.preventDefault();
    root.classList.add("leaving");
    setTimeout(() => { location.href = url.href; }, 230);
  });

  // Coming back via the browser's back button (page restored from cache)
  addEventListener("pageshow", (e) => {
    if (e.persisted) root.classList.remove("leaving");
  });
})();

// Micro-animation: reveal blocks with a soft stagger as they come into view.
(() => {
  const SELECTOR = [
    ".hero > :not(.badge)",
    ".problem > h2", ".numbered > li",
    ".proof .skewed > *",
    ".does .skewed > h2", ".dots > li",
    ".back", ".intro .lede", ".section-title", ".note",
    ".cards > li", ".steps > li", ".actions > div", ".story > .panel",
    ".foot p",
  ].join(",");

  const els = [...document.querySelectorAll(SELECTOR)];
  if (!els.length) return;

  // Stagger index = position among matching siblings
  const counts = new Map();
  els.forEach((el) => {
    const parent = el.parentElement;
    const i = counts.get(parent) || 0;
    counts.set(parent, i + 1);
    el.style.setProperty("--i", i);
    el.classList.add("rv");
  });

  const show = (el) => {
    el.classList.add("in");
    // once settled, drop the delay so later interactions are instant
    setTimeout(() => { el.style.transitionDelay = "0s"; }, 1600);
  };

  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(show);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

  // wait a frame so the page-transition snapshot is taken before things animate in
  requestAnimationFrame(() => els.forEach((el) => io.observe(el)));
})();
