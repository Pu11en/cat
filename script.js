// Simple carousel script for all .carousel elements
(function () {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach((el) => {
    const slides = Array.from(el.querySelectorAll('.slides img'));
    const prev = el.querySelector('.prev');
    const next = el.querySelector('.next');
    const dotsContainer = el.querySelector('.dots');
    const intervalMs = Number(el.getAttribute('data-interval')) || 3000;
    const autoplay = el.getAttribute('data-autoplay') === 'true';
    let index = 0;
    let timer = null;

    // Build dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(b);
    });

    function render() {
      slides.forEach((img, i) => img.classList.toggle('active', i === index));
      dotsContainer.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function restartAutoplay() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), intervalMs);
    }

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));

    // Keyboard accessibility when focused inside card
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    render();
    restartAutoplay();
  });
})();