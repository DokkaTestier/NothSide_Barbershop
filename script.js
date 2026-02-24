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

    ScrollTrigger.batch(".service-box, .section h2, .curso-content", {
      onEnter: batch => gsap.fromTo(batch, 
        { 
          y: 30, 
          opacity: 0 
        }, 
        { 
          y: 0, 
          opacity: 1, // Forzamos el 100% de opacidad
          stagger: 0.15, 
          duration: 0.8, 
          ease: "power2.out",
          overwrite: true 
        }
      ),
      start: "top 85%", // Se activa cuando la sección entra un 15% en pantalla
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
    const slides = Array.from(document.querySelectorAll(".carousel-item"));

    if (track && slides.length > 0) {
      // 1. Clonamos los elementos para crear el efecto infinito
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
      });

      // 2. Calculamos el ancho total de una vuelta
      const totalWidth = (slides[0].offsetWidth + 20) * slides.length; // 20 es el gap

      // 3. Creamos la animación infinita
      const animation = gsap.to(track, {
        x: -totalWidth,
        duration: 25, // Ajusta la velocidad (más segundos = más lento)
        ease: "none",
        repeat: -1,
        paused: false
      });

      // 4. Interaction: Se detiene un poco al pasar el mouse (opcional, estilo Apple)
      track.addEventListener("mouseenter", () => gsap.to(animation, {timeScale: 0.2, duration: 0.5}));
      track.addEventListener("mouseleave", () => gsap.to(animation, {timeScale: 1, duration: 0.5}));
  
      // Para móviles, que no se detenga al tocar para no romper la fluidez
    }


    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 600 ? 'block' : 'none';
      document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
    });
    scrollBtn.addEventListener('click', () => lenis.scrollTo(0));

    // --- Lógica de la Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
      document.addEventListener('click', (e) => {
        if (e.target.matches('.carousel-item img')) {
          lightbox.style.display = 'flex';
          setTimeout(() => lightbox.classList.add('active'), 10);
          lightboxImg.src = e.target.src;
          document.body.style.overflow = 'hidden';
        }
      });

      lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          lightbox.style.display = 'none';
          document.body.style.overflow = 'auto';
        }, 300);
      });
    }


    // --- Lógica de Contadores Animados Corregida ---
const stats = document.querySelectorAll(".stat-number");

stats.forEach((stat) => {
  const targetValue = +stat.getAttribute("data-target"); // Obtenemos el valor final del atributo data-target
  const hasPlus = stat.textContent.includes("+");// Detectamos si el texto original tiene un "+"

  ScrollTrigger.create({
    trigger: stat,
    start: "top 95%", 
    onEnter: () => {
      let countObj = { val: 0 }; // Creamos un objeto temporal para que GSAP anime el número limpiamente
      gsap.to(countObj, {
        val: targetValue,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function() {
          stat.innerText = (hasPlus ? "+" : "") + Math.floor(countObj.val); // Renderizamos el número redondeado y añadimos el "+" si es necesario
        },
        onComplete: function() {
          stat.innerText = (hasPlus ? "+" : "") + targetValue; // Al terminar, aseguramos el valor exacto final
        }
      });
    },
    once: true 
  });
});

  }); // Cierre de DOMContentLoaded
})(); // Cierre de la función anónima