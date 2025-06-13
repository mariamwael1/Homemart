document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const supermarkets = document.querySelectorAll(".supermarket");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    const visibleCount = 4;
    let currentIndex = 0;

    function updateCarousel() {
        const offset = currentIndex * (supermarkets[0].offsetWidth + 10); // +gap
        track.style.transform = `translateX(-${offset}px)`;

        // Disable buttons when at edges
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex + visibleCount >= supermarkets.length;
    }

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex + visibleCount < supermarkets.length) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Init once images load
    window.addEventListener("load", updateCarousel);
});
