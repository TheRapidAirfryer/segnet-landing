// Número de WhatsApp de SEGNET (formato internacional, sin + ni espacios)
const WHATSAPP = '50492294781';

// Header con fondo al hacer scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menú móvil
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Aparición suave de los bloques
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    io.observe(el);
  });
} else {
  items.forEach((el) => el.classList.add('is-visible'));
}

// Mensaje predeterminado para los botones de WhatsApp
const saludo = encodeURIComponent('Hola SEGNET, quisiera información sobre sus servicios.');
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${saludo}`;
});

// Formulario: arma el mensaje y lo abre en WhatsApp
const form = document.getElementById('quoteForm');
const error = document.getElementById('formError');
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const data = new FormData(form);
  const requeridos = ['nombre', 'servicio', 'necesidad'];
  let ok = true;
  requeridos.forEach((name) => {
    const field = form.elements[name];
    const vacio = !String(data.get(name) || '').trim();
    field.classList.toggle('is-invalid', vacio);
    if (vacio) ok = false;
  });
  error.hidden = ok;
  if (!ok) return;

  const lineas = [
    'Hola SEGNET, quisiera una cotización.',
    '',
    `*Nombre:* ${data.get('nombre').trim()}`,
    data.get('empresa').trim() && `*Empresa:* ${data.get('empresa').trim()}`,
    `*Servicio:* ${data.get('servicio')}`,
    `*Necesidad:* ${data.get('necesidad').trim()}`,
    data.get('ubicacion').trim() && `*Ubicación:* ${data.get('ubicacion').trim()}`,
    `*Prioridad:* ${data.get('prioridad')}`,
  ].filter((l) => l !== '' && l !== false);
  lineas.splice(1, 0, '');

  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;
  window.open(url, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();
