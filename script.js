// Dynamic carousel loader using assets/manifest.json
(function () {
  async function loadManifest() {
    try {
      const res = await fetch('assets/manifest.json');
      if (!res.ok) throw new Error('manifest not found');
      return await res.json();
    } catch (e) {
      console.warn('Using placeholders: manifest missing or invalid.', e);
      return {};
    }
  }

  function createCarousel(el, files) {
    const slidesEl = el.querySelector('.slides');
    const prev = el.querySelector('.prev');
    const next = el.querySelector('.next');
    const dotsContainer = el.querySelector('.dots');
    const intervalMs = Number(el.getAttribute('data-interval')) || 3000;
    const autoplay = el.getAttribute('data-autoplay') === 'true';
    let index = 0;
    let timer = null;

    const imgs = (files && files.length ? files : [
      'https://placehold.co/800x800/FF7A00/FFFFFF?text=Placeholder+1',
      'https://placehold.co/800x800/E44/FFFFFF?text=Placeholder+2',
      'https://placehold.co/800x800/CAA17A/FFFFFF?text=Placeholder+3'
    ]).map((src, i) => {
      const img = document.createElement('img');
      img.alt = `Slide ${i + 1}`;
      // If manifest entry is relative, prepend assets/
      img.src = src.startsWith('http') ? src : `assets/${src}`;
      img.onerror = () => {
        img.src = 'https://placehold.co/800x800/666/FFFFFF?text=Missing+Image';
      };
      slidesEl.appendChild(img);
      return img;
    });

    // Build dots
    imgs.forEach((_, i) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(b);
    });

    function render() {
      imgs.forEach((img, i) => img.classList.toggle('active', i === index));
      dotsContainer.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + imgs.length) % imgs.length;
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
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    render();
    restartAutoplay();
  }

  window.addEventListener('DOMContentLoaded', async () => {
    const manifest = await loadManifest();
    document.querySelectorAll('.carousel').forEach((el) => {
      const group = el.getAttribute('data-group');
      createCarousel(el, manifest[group]);
    });
  });
})();