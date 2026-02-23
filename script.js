(() => {

    document.addEventListener("DOMContentLoaded", () => {
    
    /////////////////////////
    // LUCIDE ICONS
    /////////////////////////
    
    lucide.createIcons();
    
    /////////////////////////
    // MENU MOBILE
    /////////////////////////
    
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const icon = hamburger.querySelector('i');
    
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('nav-active');
    
      const active = navLinks.classList.contains('nav-active');
      icon.setAttribute('data-lucide', active ? 'x' : 'menu');
    
      document.body.style.overflow = active ? 'hidden' : 'auto';
    
      lucide.createIcons();
    });
    
    /////////////////////////
    // GSAP
    /////////////////////////
    
    gsap.registerPlugin(ScrollTrigger);
    
    /////////////////////////
    // TITULOS
    /////////////////////////
    
    gsap.from("h1, h2", {
      scrollTrigger: {
        trigger: "h2",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.2
    });
    
    /////////////////////////
    // SERVICIOS
    /////////////////////////
    
    gsap.from(".service-box", {
      scrollTrigger: {
        trigger: ".services-boxes",
        start: "top 85%",
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)"
    });
    
    /////////////////////////
    // BOTON TEMARIO (SOLO ESTE)
    /////////////////////////
    
    const ctaBtn = document.querySelector("#cursos .icon-btn");
    
    gsap.from(ctaBtn, {
      scrollTrigger: {
        trigger: ctaBtn,
        start: "top 85%",
      },
      x: -100,
      opacity: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    });
    
    /////////////////////////
    // SHAKE PRO (solo al entrar en viewport)
    /////////////////////////
    
    gsap.to(ctaBtn, {
      scrollTrigger: {
        trigger: ctaBtn,
        start: "top 80%",
      },
      rotation: 2,
      duration: 0.08,
      repeat: 6,
      yoyo: true,
      repeatDelay: 4
    });
    
    });
    
    })();s