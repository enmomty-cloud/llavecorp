// PRESIONA START en la portada: pantalla de "PLAYER 1 READY", luego baja al catálogo y elige un llavero al azar
// como en una pantalla de selección de personaje. Con prefers-reduced-motion solo baja al catálogo.
const espera = (ms: number) => new Promise(r => setTimeout(r, ms));
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

async function secuencia(pantalla: HTMLElement, destino: HTMLElement) {
  const linea = pantalla.querySelector<HTMLElement>('[data-linea]')!;
  pantalla.hidden = false;
  document.body.style.overflow = 'hidden';
  const pasos = ['PLAYER 1', 'READY?', '¡GO!'];
  for (const [i, texto] of pasos.entries()) {
    linea.textContent = texto;
    linea.classList.toggle('start-pantalla__linea--go', i === pasos.length - 1);
    await espera(i === pasos.length - 1 ? 500 : 650);
  }
  document.body.style.overflow = '';
  pantalla.hidden = true;
  destino.scrollIntoView({ behavior: 'auto', block: 'start' });
  seleccionarAlAzar();
}

function seleccionarAlAzar() {
  const tarjetas = [...document.querySelectorAll<HTMLElement>('#catalogo .tarjeta[data-slug]')].filter(t => !t.classList.contains('tarjeta--agotado'));
  if (!tarjetas.length) return;
  document.querySelectorAll('.tarjeta--seleccionada').forEach(t => t.classList.remove('tarjeta--seleccionada'));
  const elegida = tarjetas[Math.floor(Math.random() * tarjetas.length)];
  elegida.classList.add('tarjeta--seleccionada');
  elegida.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const aviso = document.getElementById('start-aviso');
  if (aviso) {
    aviso.textContent = `Selección al azar: ${elegida.dataset.nombre ?? 'un llavero'}. Presiona START otra vez para cambiar.`;
    aviso.hidden = false;
  }
  document.dispatchEvent(new CustomEvent('llavecorp:powerup', { detail: { slug: elegida.dataset.slug } }));
  setTimeout(() => elegida.classList.remove('tarjeta--seleccionada'), 6000);
}

function iniciar() {
  const boton = document.querySelector<HTMLAnchorElement>('#inicio .btn--start');
  const pantalla = document.getElementById('pantalla-start');
  const destino = document.getElementById('catalogo');
  if (!boton || !pantalla || !destino) return;
  let corriendo = false;
  boton.addEventListener('click', async e => {
    e.preventDefault();
    if (reducido()) { destino.scrollIntoView(); seleccionarAlAzar(); return; }
    if (corriendo) return;
    corriendo = true;
    try { await secuencia(pantalla, destino); } finally { corriendo = false; }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
