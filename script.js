(() => {
    document.addEventListener("DOMContentLoaded", () => {
      
      if (typeof lucide !== 'undefined') lucide.createIcons();
  
      const lenis = new Lenis();
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
  
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
  
      gsap.registerPlugin(ScrollTrigger);
  
      gsap.to(".hero", {
        scrollTrigger: { trigger: ".hero", start: "top top", scrub: true },
        y: 100, scale: 1.1
      });
  
      ScrollTrigger.batch(".section h2, .service-box, .curso-content", {
        onEnter: batch => gsap.from(batch, {
          y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power2.out"
        })
      });
  
      const trigger = document.getElementById('toggle-arrow');
      const extra = document.getElementById('extra-services');
      if (trigger && extra) {
        trigger.addEventListener('click', () => {
          const isHidden = extra.style.display === 'none';
          extra.style.display = isHidden ? 'grid' : 'none';
          trigger.innerHTML = `<i data-lucide="${isHidden ? 'chevron-up' : 'chevron-down'}"></i>`;
          lucide.createIcons();
        });
      }
  
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
  
      const scrollBtn = document.getElementById('scrollTopBtn');
      window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY > 600 ? 'block' : 'none';
        document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
      });
      scrollBtn.addEventListener('click', () => lenis.scrollTo(0));
  
    });
  })();