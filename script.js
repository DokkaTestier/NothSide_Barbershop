(() => {
    document.addEventListener("DOMContentLoaded", () => {
      
      /////////////////////////
      // LUCIDE ICONS
      /////////////////////////
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
  
      //////////////////////////////////////////////////////////
      // LENIS SMOOTH SCROLL
      //////////////////////////////////////////////////////////
      const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false
      });
  
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
  
      //////////////////////////////////////////////////////////
      // NAV MENU
      //////////////////////////////////////////////////////////
      const hamburger = document.getElementById('hamburger-btn');
      const navLinks = document.getElementById('nav-links');
      const icon = hamburger?.querySelector('i');
  
      if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
          navLinks.classList.toggle('nav-active');
          const isActive = navLinks.classList.contains('nav-active');
          
          if (icon) {
            icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
            lucide.createIcons();
          }
          document.body.style.overflow = isActive ? 'hidden' : '';
        });
      }
  
      //////////////////////////////////////////////////////////
      // GSAP ANIMATIONS
      //////////////////////////////////////////////////////////
      gsap.registerPlugin(ScrollTrigger);
  
      // Batch titles
      ScrollTrigger.batch("h1, h2", {
        start: "top 85%",
        onEnter: batch => gsap.from(batch, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out"
        })
      });
  
      // Services
      if (document.querySelector(".services-boxes")) {
        gsap.from(".service-box", {
          scrollTrigger: {
            trigger: ".services-boxes",
            start: "top 85%"
          },
          scale: 0.9,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)"
        });
      }
  
      // BOTON TEMARIO (Con verificación de existencia)
      const ctaBtn = document.querySelector("#cursos .btn.icon-btn");
      if (ctaBtn) {
        // Entrada inicial
        gsap.from(ctaBtn, {
          scrollTrigger: {
            trigger: ctaBtn,
            start: "top 85%",
          },
          x: 5,
          opacity: 0,
          duration: 0.2,
          ease: "elastic.out(1, 0.6)"
        });
  
        // Shake Pro Infinito
        gsap.to(ctaBtn, {
          scrollTrigger: {
            trigger: ctaBtn,
            start: "top 80%",
          },
          keyframes: [
            { x: -18, duration: 0.04 },
            { x: 18, duration: 0.04 },
            { x: -14, duration: 0.04 },
            { x: 14, duration: 0.04 },
            { x: -10, duration: 0.04 },
            { x: 10, duration: 0.04 },
            { x: 0, duration: 0.04 }
          ],
          repeat: -1,
          repeatDelay: 1.5
        });
      }
  
      // HERO PARALLAX
      if (document.querySelector(".hero")) {
        gsap.to(".hero", {
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            scrub: true
          },
          y: 80,
          scale: 1.05,
          ease: "none"
        });
      }
  
      //////////////////////////////////////////////////////////
      // CAROUSEL LOGIC
      //////////////////////////////////////////////////////////
      const track = document.querySelector(".carousel-track");
      const slides = document.querySelectorAll(".carousel-item");
  
      if (track && slides.length > 0) {
        let position = 0;
        let velocity = 0;
        let isDragging = false;
        let lastX = 0;
  
        // Clonar slides para loop
        slides.forEach(slide => {
          const clone = slide.cloneNode(true);
          track.appendChild(clone);
        });
  
        function updateCarousel() {
          position += velocity;
          velocity *= 0.95; // Fricción
  
          const slideWidth = slides[0].offsetWidth;
          const totalWidth = slideWidth * slides.length;
  
          if (position <= -totalWidth) position += totalWidth;
          if (position > 0) position -= totalWidth;
  
          track.style.transform = `translateX(${position}px)`;
          requestAnimationFrame(updateCarousel);
        }
        updateCarousel();
  
        track.addEventListener("touchstart", e => {
          isDragging = true;
          lastX = e.touches[0].clientX;
          velocity = 0;
        }, { passive: true });
  
        track.addEventListener("touchmove", e => {
          if (!isDragging) return;
          const x = e.touches[0].clientX;
          const delta = x - lastX;
          position += delta;
          velocity = delta;
          lastX = x;
        }, { passive: true });
  
        track.addEventListener("touchend", () => {
          isDragging = false;
        });
      }
  
      //////////////////////////////////////////////////////////
      // LAZY IMAGES AUTO
      //////////////////////////////////////////////////////////
      document.querySelectorAll("img").forEach(img => {
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
      });
  
    }); // Fin DOMContentLoaded
  })();