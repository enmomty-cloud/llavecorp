// PRESIONA START en la portada: arranca la víbora (come cápsulas, no choques). Al perder sale GAME OVER
// y de ahí se baja al catálogo con un llavero elegido al azar. Con prefers-reduced-motion solo baja al catálogo.
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
type Dir = 'up' | 'down' | 'left' | 'right';
const OPUESTA: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const N = 16; // celdas por lado

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

class Vibora {
  private ctx: CanvasRenderingContext2D;
  private cuerpo: { x: number; y: number }[] = [];
  private dir: Dir = 'right';
  private proxima: Dir = 'right';
  private comida = { x: 10, y: 8 };
  private puntos = 0;
  private timer = 0;
  private viva = false;
  private colores = { fondo: '#120e24', vibora: '#28d17c', cabeza: '#ffd23f', capsulaA: '#e4342b', capsulaB: '#fffaea', rejilla: '#1c1636' };

  constructor(private canvas: HTMLCanvasElement, private alPerder: (puntos: number) => void, private alComer: () => void) {
    this.ctx = canvas.getContext('2d')!;
    const css = getComputedStyle(document.documentElement);
    const v = (n: string, def: string) => css.getPropertyValue(n).trim() || def;
    this.colores = { fondo: '#120e24', vibora: v('--verde-nfc', '#28d17c'), cabeza: v('--amarillo', '#ffd23f'), capsulaA: v('--rojo', '#e4342b'), capsulaB: '#fffaea', rejilla: '#1c1636' };
  }

  empezar() {
    this.cuerpo = [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }];
    this.dir = this.proxima = 'right';
    this.puntos = 0;
    this.viva = true;
    this.ponerComida();
    this.dibujar();
    clearInterval(this.timer);
    this.timer = window.setInterval(() => this.paso(), 140);
  }

  parar() { this.viva = false; clearInterval(this.timer); }

  girar(d: Dir) { if (this.viva && d !== OPUESTA[this.dir]) this.proxima = d; }

  private ponerComida() {
    do { this.comida = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
    while (this.cuerpo.some(c => c.x === this.comida.x && c.y === this.comida.y));
  }

  private paso() {
    this.dir = this.proxima;
    const cab = { ...this.cuerpo[0] };
    if (this.dir === 'up') cab.y--; if (this.dir === 'down') cab.y++; if (this.dir === 'left') cab.x--; if (this.dir === 'right') cab.x++;
    const choca = cab.x < 0 || cab.y < 0 || cab.x >= N || cab.y >= N || this.cuerpo.some(c => c.x === cab.x && c.y === cab.y);
    if (choca) { this.parar(); this.dibujar(); this.alPerder(this.puntos); return; }
    this.cuerpo.unshift(cab);
    if (cab.x === this.comida.x && cab.y === this.comida.y) { this.puntos++; this.alComer(); this.ponerComida(); }
    else this.cuerpo.pop();
    this.dibujar();
  }

  private dibujar() {
    const c = this.ctx, t = this.canvas.width / N;
    c.fillStyle = this.colores.fondo; c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    c.strokeStyle = this.colores.rejilla; c.lineWidth = 1;
    for (let i = 0; i <= N; i++) { c.beginPath(); c.moveTo(i * t, 0); c.lineTo(i * t, N * t); c.moveTo(0, i * t); c.lineTo(N * t, i * t); c.stroke(); }
    // cápsula: dos mitades
    const { x, y } = this.comida;
    c.fillStyle = this.colores.capsulaA; c.fillRect(x * t + 2, y * t + 4, t / 2 - 2, t - 8);
    c.fillStyle = this.colores.capsulaB; c.fillRect(x * t + t / 2, y * t + 4, t / 2 - 2, t - 8);
    this.cuerpo.forEach((s, i) => { c.fillStyle = i === 0 ? this.colores.cabeza : this.colores.vibora; c.fillRect(s.x * t + 1, s.y * t + 1, t - 2, t - 2); });
  }

  get resultado() { return this.puntos; }
}

function iniciar() {
  const boton = document.querySelector<HTMLAnchorElement>('#inicio .btn--start');
  const pantalla = document.getElementById('pantalla-start');
  const destino = document.getElementById('catalogo');
  const canvas = pantalla?.querySelector<HTMLCanvasElement>('[data-snake]');
  if (!boton || !pantalla || !destino || !canvas) return;

  const marcador = pantalla.querySelector<HTMLElement>('[data-snake-score]')!;
  const fin = pantalla.querySelector<HTMLElement>('[data-snake-fin]')!;
  const resumen = pantalla.querySelector<HTMLElement>('[data-snake-resumen]')!;
  const ayuda = pantalla.querySelector<HTMLElement>('[data-snake-ayuda]')!;

  const cerrar = () => { juego.parar(); pantalla.hidden = true; document.body.style.overflow = ''; };
  const continuar = () => { cerrar(); destino.scrollIntoView({ behavior: 'auto', block: 'start' }); seleccionarAlAzar(); };

  const juego = new Vibora(canvas, puntos => {
    fin.hidden = false;
    resumen.textContent = puntos === 0 ? 'Ni una cápsula. Como en los viejos tiempos.' : `Comiste ${puntos} ${puntos === 1 ? 'cápsula' : 'cápsulas'}. Nada mal.`;
    document.dispatchEvent(new CustomEvent('llavecorp:gameover', { detail: { puntos } }));
  }, () => {
    marcador.textContent = String(juego.resultado);
    document.dispatchEvent(new CustomEvent('llavecorp:toque'));
  });

  const abrir = () => {
    pantalla.hidden = false;
    fin.hidden = true;
    ayuda.hidden = false;
    marcador.textContent = '0';
    document.body.style.overflow = 'hidden';
    juego.empezar();
  };

  boton.addEventListener('click', e => {
    e.preventDefault();
    if (reducido()) { destino.scrollIntoView(); seleccionarAlAzar(); return; }
    abrir();
  });

  pantalla.querySelector('[data-snake-skip]')?.addEventListener('click', continuar);
  pantalla.querySelector('[data-snake-continuar]')?.addEventListener('click', continuar);
  pantalla.querySelector('[data-snake-otra]')?.addEventListener('click', abrir);
  pantalla.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach(b => b.addEventListener('click', () => juego.girar(b.dataset.dir as Dir)));

  document.addEventListener('keydown', e => {
    if (pantalla.hidden) return;
    const mapa: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
    const d = mapa[e.key];
    if (d) { e.preventDefault(); ayuda.hidden = true; juego.girar(d); }
    if (e.key === 'Escape') continuar();
  });

  let toque: { x: number; y: number } | null = null;
  canvas.addEventListener('touchstart', e => { const t = e.touches[0]; toque = { x: t.clientX, y: t.clientY }; }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    if (!toque) return;
    const t = e.touches[0], dx = t.clientX - toque.x, dy = t.clientY - toque.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    juego.girar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    ayuda.hidden = true;
    toque = { x: t.clientX, y: t.clientY };
    e.preventDefault();
  }, { passive: false });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
