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
