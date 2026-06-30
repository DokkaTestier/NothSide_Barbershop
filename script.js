(() => {
  document.addEventListener("DOMContentLoaded", () => {

    // ─── Icons ────────────────────────────────────────────────
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ─── Detect mobile ────────────────────────────────────────
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || window.matchMedia("(max-width: 768px)").matches;

    // ─── Lenis smooth scroll (desktop only) ───────────────────
    let lenis = null;
    if (!isMobile && typeof Lenis !== 'undefined') {
      lenis = new Lenis();
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    function scrollToTop() {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── Hamburger nav ────────────────────────────────────────
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks  = document.getElementById('nav-links');
    const overlay   = document.getElementById('nav-overlay');
    const icon      = hamburger?.querySelector('i');

    function closeNav() {
      navLinks?.classList.remove('nav-active');
      overlay?.classList.remove('active');
      if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
    }

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('nav-active');
        overlay?.classList.toggle('active', isOpen);
        if (icon) {
          icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
          lucide.createIcons();
        }
      });
      navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
      overlay?.addEventListener('click', closeNav);
    }

    // ─── GSAP ─────────────────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax — disabled on mobile to avoid GSAP/Lenis conflicts
    if (!isMobile) {
      gsap.to(".hero", {
        scrollTrigger: { trigger: ".hero", start: "top top", scrub: true },
        y: 80,
        scale: 1.06,
        ease: "none",
      });
    }

    // Fade-in sections
    // Use a simpler approach on mobile (CSS class toggle) to avoid GSAP issues
    if (!isMobile) {
      ScrollTrigger.batch(".service-box, .section h2, .curso-feature, .about-text, .contact-buttons", {
        onEnter: batch => gsap.fromTo(batch,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out", overwrite: true }
        ),
        start: "top 88%",
      });
    } else {
      // On mobile: simple CSS-driven reveal, no GSAP transforms
      const revealEls = document.querySelectorAll(".service-box, .curso-feature, .about-text, .contact-buttons");
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "none";
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.transform = "translateY(16px)";
        revealObserver.observe(el);
      });
    }

    // ─── Services toggle ──────────────────────────────────────
    const trigger = document.getElementById('toggle-arrow');
    const extra   = document.getElementById('extra-services');
    if (trigger && extra) {
      trigger.addEventListener('click', () => {
        const isHidden = extra.style.display === 'none';
        extra.style.display = isHidden ? 'grid' : 'none';
        trigger.innerHTML = `<i data-lucide="${isHidden ? 'chevron-up' : 'chevron-down'}"></i>`;
        lucide.createIcons();
        // Refresh ScrollTrigger if new boxes appeared (desktop)
        if (!isMobile && isHidden) ScrollTrigger.refresh();
      });
    }

    // ─── Carousel infinito (Trabajos) ─────────────────────────
    const track  = document.querySelector(".carousel-track");
    const slides = Array.from(document.querySelectorAll(".carousel-item"));

    if (track && slides.length > 0) {
      // Clone slides for infinite effect
      slides.forEach(slide => track.appendChild(slide.cloneNode(true)));

      const gap = 16;
      // Use a callback to ensure images might have loaded sizes
      const init = () => {
        const slideW = slides[0].offsetWidth + gap;
        const totalW = slideW * slides.length;

        const anim = gsap.to(track, {
          x: -totalW,
          duration: 28,
          ease: "none",
          repeat: -1,
        });

        // Slow on hover (desktop) / don't interfere on mobile
        if (!isMobile) {
          track.addEventListener("mouseenter", () => gsap.to(anim, { timeScale: 0.2, duration: 0.5 }));
          track.addEventListener("mouseleave", () => gsap.to(anim, { timeScale: 1, duration: 0.5 }));
        }
      };

      // Small delay to let layout settle
      setTimeout(init, 100);
    }

    // ─── Promo carousel ───────────────────────────────────────
    const promoSlides = document.querySelectorAll('.promo-slide');
    const promoDots   = document.querySelectorAll('.promo-dot');
    let currentPromo  = 0;

    function goToPromo(idx) {
      promoSlides[currentPromo].classList.remove('active');
      promoDots[currentPromo]?.classList.remove('active');
      currentPromo = idx % promoSlides.length;
      promoSlides[currentPromo].classList.add('active');
      promoDots[currentPromo]?.classList.add('active');
    }

    if (promoSlides.length > 0) {
      setInterval(() => goToPromo(currentPromo + 1), 5000);
      promoDots.forEach((dot, i) => dot.addEventListener('click', () => goToPromo(i)));
    }

    // ─── Scroll events ────────────────────────────────────────
    const scrollBtn = document.getElementById('scrollTopBtn');
    const header    = document.querySelector('.header');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (scrollBtn) scrollBtn.style.display = y > 600 ? 'flex' : 'none';
      header?.classList.toggle('scrolled', y > 50);
    }, { passive: true });

    scrollBtn?.addEventListener('click', scrollToTop);

    // ─── Lightbox ─────────────────────────────────────────────
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
      document.addEventListener('click', (e) => {
        if (e.target.matches('.carousel-item img')) {
          lightbox.style.display = 'flex';
          requestAnimationFrame(() => lightbox.classList.add('active'));
          lightboxImg.src = e.target.src;
          document.body.style.overflow = 'hidden';
        }
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
          lightbox.style.display = 'none';
          document.body.style.overflow = '';
        }, 350);
      }

      lightbox.addEventListener('click', closeLightbox);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
      });
    }

    // ─── Animated counters ────────────────────────────────────
    document.querySelectorAll(".stat-number").forEach((stat) => {
      const targetValue = +stat.getAttribute("data-target");
      const hasPlus = stat.textContent.includes("+");

      ScrollTrigger.create({
        trigger: stat,
        start: "top 92%",
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetValue,
            duration: 2,
            ease: "power2.out",
            onUpdate() { stat.innerText = (hasPlus ? "+" : "") + Math.floor(obj.val); },
            onComplete() { stat.innerText = (hasPlus ? "+" : "") + targetValue; }
          });
        },
        once: true
      });
    });

  }); // DOMContentLoaded
})();
