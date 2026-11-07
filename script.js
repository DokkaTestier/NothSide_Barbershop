(() => {
  document.addEventListener("DOMContentLoaded", () => {

    // ─── 1. Initialize Lucide Icons ───────────────────────────
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // ─── 2. Environment Detection ─────────────────────────────
    const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || window.matchMedia("(max-width: 768px)").matches;

    if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // ─── 3. Lenis Smooth Scroll + GSAP Sync (Desktop) ─────────
    let lenis = null;
    if (!isMobile && !prefersReducedMotion && typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      if (hasGSAP) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }

    // Smooth anchor navigation with header offset
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -76 });
        } else {
          const top = targetEl.getBoundingClientRect().top + window.scrollY - 76;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });

    function scrollToTop() {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ─── 4. Hamburger Mobile Navigation ───────────────────────
    const hamburger = document.getElementById("hamburger-btn");
    const navLinks  = document.getElementById("nav-links");
    const overlay   = document.getElementById("nav-overlay");

    function setNavState(isOpen) {
      if (!hamburger || !navLinks) return;
      navLinks.classList.toggle("nav-active", isOpen);
      hamburger.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      overlay?.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        const isOpen = !navLinks.classList.contains("nav-active");
        setNavState(isOpen);
      });

      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setNavState(false));
      });

      overlay?.addEventListener("click", () => setNavState(false));

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("nav-active")) {
          setNavState(false);
        }
      });
    }

    // ─── 5. Scroll Spy & Header State ─────────────────────────
    const scrollBtn = document.getElementById("scrollTopBtn");
    const header    = document.getElementById("header");
    const sections  = document.querySelectorAll("main section[id]");
    const navItems  = document.querySelectorAll(".nav-link");

    function onScrollUpdate() {
      const y = window.scrollY;
      scrollBtn?.classList.toggle("visible", y > 550);
      header?.classList.toggle("scrolled", y > 40);

      // Update active nav link
      let currentSection = "";
      sections.forEach((sec) => {
        const top = sec.offsetTop - 160;
        const height = sec.offsetHeight;
        if (y >= top && y < top + height) {
          currentSection = sec.getAttribute("id");
        }
      });

      if (currentSection) {
        navItems.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
        });
      }
    }

    window.addEventListener("scroll", onScrollUpdate, { passive: true });
    onScrollUpdate();
    scrollBtn?.addEventListener("click", scrollToTop);

    // ─── 6. Hero Parallax & Reveal Animations ─────────────────
    if (hasGSAP && !isMobile && !prefersReducedMotion) {
      gsap.to(".hero-bg", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        yPercent: 18,
        scale: 1.06,
        ease: "none",
      });

      ScrollTrigger.batch(
        ".service-box, .section-header, .curso-feature, .curso-syllabus-card, .about-card, .faq-item, .contact-card",
        {
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { y: 26, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.65,
                ease: "power2.out",
                overwrite: true,
              }
            ),
          start: "top 88%",
          once: true,
        }
      );
    } else if (!prefersReducedMotion) {
      const revealEls = document.querySelectorAll(
        ".service-box, .curso-feature, .curso-syllabus-card, .about-card, .faq-item, .contact-card"
      );
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.style.opacity = "1";
              e.target.style.transform = "none";
              revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.transform = "translateY(16px)";
        revealObserver.observe(el);
      });
    }

    // ─── 7. Extra Services Accordion ──────────────────────────
    const toggleBtn    = document.getElementById("toggle-arrow");
    const extraWrapper = document.getElementById("extra-services-wrapper");
    const toggleText   = toggleBtn?.querySelector(".expand-btn-text");

    if (toggleBtn && extraWrapper) {
      toggleBtn.addEventListener("click", () => {
        const isOpen = extraWrapper.classList.toggle("is-open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        extraWrapper.setAttribute("aria-hidden", String(!isOpen));

        if (toggleText) {
          toggleText.textContent = isOpen ? "Ver menos servicios" : "Ver todos los servicios";
        }

        if (hasGSAP && !isMobile) {
          setTimeout(() => ScrollTrigger.refresh(), 460);
        }
      });
    }

    // ─── 8. Infinite Work Carousel (Responsive & Seamless) ────
    const workTrack  = document.getElementById("work-track");
    const baseSlides = workTrack ? Array.from(workTrack.querySelectorAll(".carousel-item")) : [];

    // Tag each original item with its gallery index before cloning
    baseSlides.forEach((slide, idx) => {
      slide.setAttribute("data-index", String(idx));
    });

    if (workTrack && baseSlides.length > 0 && hasGSAP && !prefersReducedMotion) {
      // Clone once for seamless loop (clones inherit data-index)
      baseSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        workTrack.appendChild(clone);
      });

      let marqueeTween = null;

      function setupMarquee() {
        if (marqueeTween) marqueeTween.kill();
        gsap.set(workTrack, { x: 0 });

        const gap = parseFloat(getComputedStyle(workTrack).gap) || 18;
        const slideW = baseSlides[0].offsetWidth + gap;
        const totalW = slideW * baseSlides.length;

        marqueeTween = gsap.to(workTrack, {
          x: -totalW,
          duration: 30,
          ease: "none",
          repeat: -1,
        });
      }

      setupMarquee();

      if (!isMobile) {
        workTrack.addEventListener("mouseenter", () => {
          if (marqueeTween) gsap.to(marqueeTween, { timeScale: 0.2, duration: 0.4 });
        });
        workTrack.addEventListener("mouseleave", () => {
          if (marqueeTween) gsap.to(marqueeTween, { timeScale: 1, duration: 0.4 });
        });
      }

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupMarquee, 200);
      });
    }

    // ─── 9. Promo Carousel (Auto, Dots, Arrows & Swipe) ───────
    const promoCarousel = document.getElementById("promo-carousel");
    const promoSlides   = document.querySelectorAll(".promo-slide");
    const promoDots     = document.querySelectorAll(".promo-dot");
    const promoPrev     = document.getElementById("promo-prev");
    const promoNext     = document.getElementById("promo-next");
    let currentPromo    = 0;
    let promoTimer      = null;

    function goToPromo(idx) {
      if (!promoSlides.length) return;
      promoSlides[currentPromo].classList.remove("active");
      promoDots[currentPromo]?.classList.remove("active");
      promoDots[currentPromo]?.setAttribute("aria-selected", "false");

      currentPromo = (idx + promoSlides.length) % promoSlides.length;

      promoSlides[currentPromo].classList.add("active");
      promoDots[currentPromo]?.classList.add("active");
      promoDots[currentPromo]?.setAttribute("aria-selected", "true");
    }

    function startPromoTimer() {
      stopPromoTimer();
      promoTimer = setInterval(() => goToPromo(currentPromo + 1), 5500);
    }

    function stopPromoTimer() {
      if (promoTimer) clearInterval(promoTimer);
    }

    if (promoSlides.length > 0) {
      startPromoTimer();

      promoDots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          goToPromo(i);
          startPromoTimer();
        });
      });

      promoPrev?.addEventListener("click", () => {
        goToPromo(currentPromo - 1);
        startPromoTimer();
      });

      promoNext?.addEventListener("click", () => {
        goToPromo(currentPromo + 1);
        startPromoTimer();
      });

      promoCarousel?.addEventListener("mouseenter", stopPromoTimer);
      promoCarousel?.addEventListener("mouseleave", startPromoTimer);

      // Touch swipe support for mobile
      let touchStartX = 0;
      promoCarousel?.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopPromoTimer();
      }, { passive: true });

      promoCarousel?.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 45) {
          goToPromo(diff < 0 ? currentPromo + 1 : currentPromo - 1);
        }
        startPromoTimer();
      }, { passive: true });
    }

    // ─── 10. Lightbox with Swipe, Drag & Keyboard Navigation ──
    const lightbox        = document.getElementById("lightbox");
    const lightboxImg     = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const lightboxClose   = document.getElementById("lightbox-close");
    const lightboxPrev    = document.getElementById("lightbox-prev");
    const lightboxNext    = document.getElementById("lightbox-next");

    const galleryData = baseSlides.map((slide) => {
      const img = slide.querySelector("img");
      return {
        src: img?.src || "",
        alt: img?.alt || "Trabajo ampliado",
        caption: slide.getAttribute("data-caption") || img?.alt || "",
      };
    });

    let currentLightboxIdx = 0;

    function renderLightboxSlide(idx, direction = 0) {
      if (!galleryData.length || !lightboxImg) return;
      currentLightboxIdx = (idx + galleryData.length) % galleryData.length;
      const item = galleryData[currentLightboxIdx];

      if (direction !== 0) {
        const offsetOut = direction > 0 ? -45 : 45;
        const offsetIn  = direction > 0 ? 45 : -45;
        lightboxImg.style.transition = "transform 0.16s ease-in, opacity 0.16s ease-in";
        lightboxImg.style.transform  = `translateX(${offsetOut}px) scale(0.96)`;
        lightboxImg.style.opacity    = "0";

        setTimeout(() => {
          lightboxImg.src = item.src;
          lightboxImg.alt = item.alt;
          if (lightboxCaption) lightboxCaption.textContent = item.caption;
          if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${galleryData.length}`;

          lightboxImg.style.transition = "none";
          lightboxImg.style.transform  = `translateX(${offsetIn}px) scale(0.96)`;

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              lightboxImg.style.transition = "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease-out";
              lightboxImg.style.transform  = "translateX(0) scale(1)";
              lightboxImg.style.opacity    = "1";
            });
          });
        }, 150);
      } else {
        lightboxImg.style.transition = "";
        lightboxImg.style.transform  = "";
        lightboxImg.style.opacity    = "";
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        if (lightboxCaption) lightboxCaption.textContent = item.caption;
        if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${galleryData.length}`;
      }
    }

    function openLightboxAt(idx) {
      if (!lightbox || !lightboxImg || !galleryData.length) return;
      renderLightboxSlide(idx, 0);
      lightbox.style.display = "flex";
      lightbox.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => lightbox.classList.add("active"));
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
        if (lightboxImg) {
          lightboxImg.style.transition = "";
          lightboxImg.style.transform  = "";
          lightboxImg.style.opacity    = "";
        }
      }, 280);
    }

    function nextLightboxSlide() {
      renderLightboxSlide(currentLightboxIdx + 1, 1);
    }

    function prevLightboxSlide() {
      renderLightboxSlide(currentLightboxIdx - 1, -1);
    }

    if (lightbox && lightboxImg) {
      document.addEventListener("click", (e) => {
        const item = e.target.closest(".carousel-item");
        if (item) {
          const idx = Number(item.getAttribute("data-index")) || 0;
          openLightboxAt(idx);
        }
      });

      lightboxPrev?.addEventListener("click", (e) => {
        e.stopPropagation();
        prevLightboxSlide();
      });

      lightboxNext?.addEventListener("click", (e) => {
        e.stopPropagation();
        nextLightboxSlide();
      });

      lightboxClose?.addEventListener("click", closeLightbox);

      // Interactive Touch Swipe & Mouse Drag
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let deltaX = 0;
      let didSwipe = false;

      function onDragStart(clientX, clientY) {
        if (!lightbox.classList.contains("active")) return;
        isDragging = true;
        didSwipe = false;
        startX = clientX;
        startY = clientY;
        deltaX = 0;
        lightboxImg.style.transition = "none";
      }

      function onDragMove(clientX, clientY) {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;

        // Only track horizontal drag
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          didSwipe = true;
          deltaX = dx;
          const rotate = Math.max(-6, Math.min(6, dx * 0.025));
          const opacity = Math.max(0.55, 1 - Math.abs(dx) / 500);
          lightboxImg.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
          lightboxImg.style.opacity   = String(opacity);
        }
      }

      function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        if (Math.abs(deltaX) > 55) {
          if (deltaX < 0) nextLightboxSlide();
          else prevLightboxSlide();
        } else if (didSwipe) {
          // Snap back smoothly if swipe was too short
          lightboxImg.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease";
          lightboxImg.style.transform  = "translateX(0) scale(1)";
          lightboxImg.style.opacity    = "1";
        }
        deltaX = 0;
      }

      // Touch events (mobile)
      lightbox.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      lightbox.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1) {
          onDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      lightbox.addEventListener("touchend", onDragEnd, { passive: true });

      // Mouse drag events (desktop)
      lightboxImg.addEventListener("mousedown", (e) => {
        e.preventDefault();
        onDragStart(e.clientX, e.clientY);
      });

      window.addEventListener("mousemove", (e) => {
        onDragMove(e.clientX, e.clientY);
      });

      window.addEventListener("mouseup", onDragEnd);

      // Close on backdrop click (ignore if user just dragged)
      lightbox.addEventListener("click", (e) => {
        if (didSwipe) {
          didSwipe = false;
          return;
        }
        if (e.target === lightbox || e.target.id === "lightbox-figure") {
          closeLightbox();
        }
      });

      // Keyboard navigation (Escape, Left, Right)
      document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowRight") nextLightboxSlide();
        else if (e.key === "ArrowLeft") prevLightboxSlide();
      });
    }

    // ─── 11. Animated Counters ────────────────────────────────
    const statNumbers = document.querySelectorAll(".stat-number");

    statNumbers.forEach((stat) => {
      const targetValue = Number(stat.getAttribute("data-target")) || 0;
      const prefix = stat.getAttribute("data-prefix") || "";

      const animateStat = () => {
        if (hasGSAP && !prefersReducedMotion) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetValue,
            duration: 1.8,
            ease: "power2.out",
            onUpdate() {
              stat.textContent = `${prefix}${Math.floor(obj.val)}`;
            },
            onComplete() {
              stat.textContent = `${prefix}${targetValue}`;
            },
          });
        } else {
          stat.textContent = `${prefix}${targetValue}`;
        }
      };

      if (hasGSAP) {
        ScrollTrigger.create({
          trigger: stat,
          start: "top 92%",
          onEnter: animateStat,
          once: true,
        });
      } else {
        animateStat();
      }
    });

  });
})();
