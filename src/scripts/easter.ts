// Easter eggs: código Konami, cinco toques a la mascota y escribir "vhs". Nada de esto corre con prefers-reduced-motion.
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Botín pixel original (rejilla 16x16): espada, escudo, corazón, llave, triángulo dorado, gema.
const BOTIN: { d: string; color: string }[] = [
  { d: 'M9 1h3v2h-1v6h-1v1H9V4H8V2h1zM5 9h3v2H7v3H6v1H5zM3 11h2v2H4v2H3zM12 9h2v1h-1v1h-1z', color: 'var(--cian)' },
  { d: 'M3 2h10v6l-1 3-4 4-4-4-1-3zM6 5v5l2 2 2-2V5z', color: 'var(--rojo)' },
  { d: 'M2 3h3v1h1v1h1v1h2V5h1V4h1V3h3v1h1v3h-1v1h-1v1h-1v1h-1v1H8v1H7v-1H6v-1H5V9H4V8H3V7H2V4h1z', color: 'var(--rojo)' },
  { d: 'M2 5h5v2h6v2h-2v2h-2V9H7v2H2zM4 7v2h1V7z', color: 'var(--amarillo)' },
  { d: 'M8 2l6 11H2z', color: 'var(--amarillo)' },
  { d: 'M5 3h6l3 4-6 7-6-7zM6 5L4 7h8l-2-2z', color: 'var(--verde-nfc)' },
];

export function lluviaBotin(cantidad = 36): void {
  if (reducido()) return;
  for (let i = 0; i < cantidad; i++) {
    const item = BOTIN[i % BOTIN.length];
    const s = document.createElement('span');
    s.className = 'botin-cae';
    s.innerHTML = `<svg viewBox="0 0 16 16" width="28" height="28" shape-rendering="crispEdges" aria-hidden="true"><path d="${item.d}" fill="${item.color}" fill-rule="evenodd"/></svg>`;
    s.style.left = `${Math.random() * 100}vw`;
    s.style.animationDelay = `${Math.random() * 1.5}s`;
    s.style.animationDuration = `${2.4 + Math.random() * 1.6}s`;
    s.setAttribute('aria-hidden', 'true');
    s.addEventListener('animationend', () => s.remove());
    document.body.appendChild(s);
  }
  const aviso = document.createElement('p');
  aviso.className = 'botin-aviso pixel';
  aviso.textContent = '¡CÓDIGO SECRETO!';
  aviso.setAttribute('role', 'status');
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2600);
  document.dispatchEvent(new CustomEvent('llavecorp:easter'));
}

export function alternarVhs(): void {
  if (reducido()) return;
  document.documentElement.classList.toggle('vhs');
  document.dispatchEvent(new CustomEvent('llavecorp:easter'));
}

function iniciar() {
  let teclas: string[] = [];
  let letras = '';
  document.addEventListener('keydown', e => {
    teclas = [...teclas, e.key].slice(-KONAMI.length);
    if (teclas.join() === KONAMI.join()) { teclas = []; lluviaBotin(); }
    if (e.key.length === 1) {
      letras = (letras + e.key.toLowerCase()).slice(-3);
      if (letras === 'vhs' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) { letras = ''; alternarVhs(); }
    }
  });

  let toques: number[] = [];
  document.addEventListener('click', e => {
    if (!(e.target as Element).closest?.('.mascota')) return;
    const ahora = Date.now();
    toques = [...toques.filter(t => ahora - t < 3000), ahora];
    if (toques.length >= 5) { toques = []; lluviaBotin(); }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
