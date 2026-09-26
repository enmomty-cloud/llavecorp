// Easter eggs: código Konami y cinco toques a la mascota abren la escena del tesoro; escribir "vhs" cambia la señal.
// Nada de esto corre con prefers-reduced-motion. Todo el arte es original (Llavi, cofre, triángulo dorado).
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Botín pixel (rejilla 16x16): espada, escudo, corazón, llave, triángulo dorado, gema.
const BOTIN: { d: string; color: string }[] = [
  { d: 'M9 1h3v2h-1v6h-1v1H9V4H8V2h1zM5 9h3v2H7v3H6v1H5zM3 11h2v2H4v2H3zM12 9h2v1h-1v1h-1z', color: 'var(--cian)' },
  { d: 'M3 2h10v6l-1 3-4 4-4-4-1-3zM6 5v5l2 2 2-2V5z', color: 'var(--rojo)' },
  { d: 'M2 3h3v1h1v1h1v1h2V5h1V4h1V3h3v1h1v3h-1v1h-1v1h-1v1h-1v1H8v1H7v-1H6v-1H5V9H4V8H3V7H2V4h1z', color: 'var(--rojo)' },
  { d: 'M2 5h5v2h6v2h-2v2h-2V9H7v2H2zM4 7v2h1V7z', color: 'var(--amarillo)' },
  { d: 'M8 2l6 11H2z', color: 'var(--amarillo)' },
  { d: 'M5 3h6l3 4-6 7-6-7zM6 5L4 7h8l-2-2z', color: 'var(--verde-nfc)' },
];

// Llavi corriendo (rejilla de 4 px, igual que Mascota.astro en estado "poder", con piernas alternas vía CSS).
const LLAVI = `<svg viewBox="0 0 96 128" width="72" height="96" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="16" y="4" width="64" height="56" rx="14" fill="var(--tinta)"/><rect x="20" y="8" width="56" height="48" rx="12" fill="var(--fondo)"/>
  <g fill="var(--tinta)"><rect x="32" y="30" width="4" height="4"/><rect x="36" y="26" width="4" height="4"/><rect x="40" y="30" width="4" height="4"/><rect x="52" y="30" width="4" height="4"/><rect x="56" y="26" width="4" height="4"/><rect x="60" y="30" width="4" height="4"/></g>
  <rect x="26" y="38" width="6" height="4" fill="var(--rojo)"/><rect x="64" y="38" width="6" height="4" fill="var(--rojo)"/>
  <g fill="var(--tinta)"><rect x="40" y="44" width="4" height="4"/><rect x="44" y="48" width="8" height="4"/><rect x="52" y="44" width="4" height="4"/></g>
  <rect x="24" y="60" width="48" height="10" fill="var(--rojo)"/><rect x="12" y="62" width="14" height="8" fill="var(--rojo)"/>
  <rect x="36" y="70" width="24" height="46" fill="var(--tinta)"/><rect x="40" y="74" width="16" height="38" fill="var(--fondo)"/>
  <rect x="60" y="100" width="12" height="8" fill="var(--tinta)"/><rect x="60" y="112" width="16" height="8" fill="var(--tinta)"/>
  <g fill="var(--tinta)"><rect x="22" y="76" width="14" height="6"/><rect x="60" y="84" width="14" height="6"/></g>
</svg>`;

// Cofre (tapa y base separadas para abrirlo) y triángulo dorado.
const COFRE = `<svg viewBox="0 0 16 16" width="112" height="112" shape-rendering="crispEdges" aria-hidden="true">
  <g class="tesoro__tapa"><path d="M2 1h12v1h1v3H1V2h1z" fill="var(--tinta)"/><rect x="2" y="2" width="12" height="2" fill="var(--rojo)"/><rect x="3" y="3" width="2" height="1" fill="var(--amarillo)"/><rect x="11" y="3" width="2" height="1" fill="var(--amarillo)"/></g>
  <path d="M1 5h14v9H1z" fill="var(--tinta)"/><rect x="2" y="6" width="12" height="7" fill="var(--rojo)"/><rect x="7" y="6" width="2" height="2" fill="var(--amarillo)"/><rect x="3" y="10" width="2" height="2" fill="var(--amarillo)"/><rect x="11" y="10" width="2" height="2" fill="var(--amarillo)"/>
</svg>`;
const TRIANGULO = `<svg viewBox="0 0 16 16" width="80" height="80" shape-rendering="crispEdges" aria-hidden="true"><path d="M8 1l7 13H1z" fill="var(--tinta)"/><path d="M8 4l4.5 8.5h-9z" fill="var(--amarillo)"/></svg>`;

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
}

let escenaActiva = false;
/** Llavi corre por la mazmorra, abre el cofre y saca el triángulo dorado. Luego llueve el botín. */
export function escenaTesoro(): void {
  if (reducido() || escenaActiva) return;
  escenaActiva = true;
  const escena = document.createElement('div');
  escena.className = 'tesoro scanlines';
  escena.setAttribute('role', 'status');
  escena.innerHTML = `
    <div class="tesoro__piso"></div>
    <div class="tesoro__cofre">${COFRE}<div class="tesoro__triangulo">${TRIANGULO}</div></div>
    <div class="tesoro__llavi">${LLAVI}</div>
    <p class="tesoro__texto pixel">¡TESORO ENCONTRADO!</p>`;
  document.body.appendChild(escena);
  requestAnimationFrame(() => escena.classList.add('tesoro--corre'));
  setTimeout(() => { escena.classList.add('tesoro--abre'); document.dispatchEvent(new CustomEvent('llavecorp:easter')); }, 1900);
  setTimeout(() => { escena.classList.add('tesoro--sube'); lluviaBotin(); }, 2500);
  setTimeout(() => { escena.classList.add('tesoro--fin'); }, 5200);
  setTimeout(() => { escena.remove(); escenaActiva = false; }, 5900);
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
    if (teclas.join() === KONAMI.join()) { teclas = []; escenaTesoro(); }
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
    if (toques.length >= 5) { toques = []; escenaTesoro(); }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
