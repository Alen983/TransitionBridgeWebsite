// TODO: replace with the real demo video URL (YouTube, Loom, etc.)
const DEMO_URL = "";

document.querySelectorAll("[data-demo-link]").forEach((a) => {
  if (DEMO_URL) {
    a.href = DEMO_URL;
    a.target = "_blank";
    a.rel = "noopener";
  } else {
    a.addEventListener("click", (e) => e.preventDefault());
  }
});
