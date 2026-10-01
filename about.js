const viewer = document.getElementById("viewer");
const imgBox = document.getElementById("viewer-img");
const tagEl = document.getElementById("viewer-tag");
const titleEl = document.getElementById("viewer-title");
const textEl = document.getElementById("viewer-text");
const countEl = document.getElementById("count");
const cards = [...document.querySelectorAll(".card")];
let current = 0;

function fill(index) {
  current = (index + cards.length) % cards.length;
  const card = cards[current];

  imgBox.replaceChildren(card.querySelector(".thumb svg").cloneNode(true));
  tagEl.textContent = card.querySelector(".tag").textContent;
  titleEl.textContent = card.querySelector(".title").textContent;
  textEl.innerHTML = card.querySelector(".full").innerHTML;
  countEl.textContent = `${String(current + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  viewer.scrollTop = 0;
}

function openAt(index) {
  fill(index);
  if (!viewer.open) {
    viewer.showModal();
    document.documentElement.style.overflow = "hidden";
  }
}

cards.forEach((card, i) => card.addEventListener("click", () => openAt(i)));

viewer.querySelector(".close").addEventListener("click", () => viewer.close());
document.getElementById("prev").addEventListener("click", () => fill(current - 1));
document.getElementById("next").addEventListener("click", () => fill(current + 1));

// Click on the dimmed backdrop closes the viewer
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.close();
});

viewer.addEventListener("close", () => {
  document.documentElement.style.overflow = "";
});

viewer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") fill(current - 1);
  if (e.key === "ArrowRight") fill(current + 1);
});
