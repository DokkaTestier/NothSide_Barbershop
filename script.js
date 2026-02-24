(() => {
  document.addEventListener("DOMContentLoaded", () => {
    
    // Iconos
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Smooth Scroll (Lenis)
    const lenis = new Lenis();
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Menú Móvil
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const icon = hamburger?.querySelector('i');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        const active = navLinks.classList.contains('nav-active');
        if (icon) {
          icon.setAttribute('data-lucide', active ? 'x' : 'menu');
          lucide.createIcons();
        }
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('nav-active');
          if (icon) icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        });
      });
    }

    // Animaciones GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Fade in para las cajas de servicio de forma segura
    gsap.from(".service-box", {
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%",
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out"
    });

    // Acordeón de Servicios
    const trigger = document.getElementById('toggle-arrow');
    const extra = document.getElementById('extra-services');
    if (trigger && extra) {
      trigger.addEventListener('click', () => {
        extra.classList.toggle('show');
        const isVisible = extra.classList.contains('show');
        trigger.innerHTML = `<i data-lucide="${isVisible ? 'chevron-up' : 'chevron-down'}"></i>`;
        lucide.createIcons();
        
        if(isVisible) {
          gsap.from(extra.querySelectorAll('.service-box'), {
            y: 20, opacity: 0, stagger: 0.1, duration: 0.5
          });
        }
      });
    }

    // Carrusel
    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".carousel-item");
    if (track && slides.length > 0) {
      let position = 0, velocity = 0, isDragging = false, lastX = 0;
      slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
      function update() {
        position += velocity; velocity *= 0.95;
        const totalW = slides[0].offsetWidth * slides.length;
        if (position <= -totalW) position += totalW;
        if (position > 0) position -= totalW;
        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(update);
      }
      update();
      const start = (x) => { isDragging = true; lastX = x; velocity = 0; track.style.cursor = 'grabbing'; };
      const move = (x) => { if (!isDragging) return; let delta = x - lastX; position += delta; velocity = delta; lastX = x; };
      const end = () => { isDragging = false; track.style.cursor = 'grab'; };
      track.addEventListener('mousedown', e => start(e.clientX));
      window.addEventListener('mousemove', e => move(e.clientX));
      window.addEventListener('mouseup', end);
      track.addEventListener('touchstart', e => start(e.touches[0].clientX), {passive:true});
      track.addEventListener('touchmove', e => move(e.touches[0].clientX), {passive:true});
      track.addEventListener('touchend', end);
    }

    // Scroll Top
    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 600 ? 'block' : 'none';
      document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
    });
    scrollBtn.addEventListener('click', () => lenis.scrollTo(0));

  });
})();