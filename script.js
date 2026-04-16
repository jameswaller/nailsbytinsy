const track = document.querySelector(".carousel-track");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

nextBtn.addEventListener("click", () => {
  track.scrollBy({ left: 350, behavior: "smooth" });
});

prevBtn.addEventListener("click", () => {
  track.scrollBy({ left: -350, behavior: "smooth" });
});
