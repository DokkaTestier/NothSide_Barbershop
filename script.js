// Inicializar iconos de Lucide
lucide.createIcons();

const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');
const icon = hamburger.querySelector('i');

// Evento al hacer clic en el botón
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');

  const isActive = navLinks.classList.contains('nav-active');
  
  // Cambia el icono
  icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
  lucide.createIcons();

  // Bloquea el scroll al abrir el menú
  document.body.style.overflow = isActive ? 'hidden' : 'auto';
});


// Registramos el plugin para que GSAP sepa que lo vamos a usar
gsap.registerPlugin(ScrollTrigger);

// 1. Efecto de "Revelación" para los Títulos
// Hará que los títulos aparezcan desde abajo con un ligero desenfoque
gsap.from("h2, h1", {
    scrollTrigger: {
        trigger: "h2", // Se activa cuando aparece un h2
        start: "top 80%", // Empieza cuando el título está al 80% de la pantalla
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2 // Si hay varios títulos, aparecen uno tras otro
});

// 2. Efecto para las "Tarjetas" o "Servicios"
// Ideal para que tus servicios de corte entren con un efecto de escala
gsap.from(".servicio-card", { // Cambia ".servicio-card" por la clase de tus cuadros de servicios
    scrollTrigger: {
        trigger: ".servicio-card",
        start: "top 85%",
    },
    scale: 0.8,
    opacity: 0,
    duration: 1,
    stagger: 0.2, // Crea ese efecto de "cascada" muy elegante
    ease: "back.out(1.7)"
});

// 3. El Botón de Temario que creamos
// Queremos que llame la atención haciendo un pequeño "pop" cuando lleguen a él
gsap.from(".btn-download", {
    scrollTrigger: {
        trigger: ".btn-download",
        start: "top 90%",
    },
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "elastic.out(1, 0.5)"
});