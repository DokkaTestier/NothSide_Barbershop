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
// Entren con un efecto de escala
gsap.from(".service-box", { // Cambia ".servicio-card" por la clase de tus cuadros de servicios
    scrollTrigger: {
        trigger: ".services-boxes",
        start: "top 85%",
    },
    scale: 0.8,
    opacity: 0,
    duration: 1,
    stagger: 0.2, // Crea ese fx de "cascada" muy elegante
    ease: "back.out(1.7)"
});

// 3. El Botón de Temario
// Ppequeño "pop" cuando lleguen a él
gsap.from(".btn.icon-btn", {
    scrollTrigger: {
        trigger: ".btn.icon-btn",
        start: "top 90%",
    },
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "elastic.out(1, 0.5)"
});

// Animación de sacudida (Shake) infinita
gsap.to(".btn.icon-btn", {
  duration: 0.1,        // Duración de cada movimiento individual
  x: 5,                 // Se mueve 5 píxeles a la derecha
  repeat: 5,            // Se repite 5 veces (el "temblor")
  yoyo: true,           // Va y vuelve para crear el efecto vibración
  ease: "power1.inOut",
  repeatDelay: 2,       // <--- AQUÍ está la clave: espera 2 segundos antes de volver a empezar
  delay: 1              // Espera un segundo al cargar la página por primera vez
});