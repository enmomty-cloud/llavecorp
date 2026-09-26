// Sonidos 8-bit con Web Audio (ondas cuadradas), sin archivos de audio. Apagado por defecto.
const CLAVE = 'llavecorp-sonido';
let ctx: AudioContext | null = null;

function encendido(): boolean {
  try { return localStorage.getItem(CLAVE) === 'on'; } catch { return false; }
}
function guardar(on: boolean) {
  try { localStorage.setItem(CLAVE, on ? 'on' : 'off'); } catch { /* sin almacenamiento */ }
}
function contexto(): AudioContext | null {
  if (!('AudioContext' in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function beep(freq: number, ms: number, cuando = 0): void {
  const c = contexto(); if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.06, c.currentTime + cuando);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + cuando + ms / 1000);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + cuando);
  osc.stop(c.currentTime + cuando + ms / 1000);
}

export function sonidoStart(): void { beep(660, 90); beep(880, 140, 0.1); }
export function sonidoPowerUp(): void { [523, 659, 784, 1047].forEach((f, i) => beep(f, 120, i * 0.09)); }
export function sonidoToque(): void { beep(440, 50); }

function iniciar() {
  const boton = document.querySelector<HTMLButtonElement>('[data-toggle-sonido]');
  const pintar = () => {
    if (!boton) return;
    const on = encendido();
    boton.textContent = on ? 'Sonido: encendido' : 'Sonido: apagado';
    boton.setAttribute('aria-pressed', String(on));
  };
  boton?.addEventListener('click', () => { const on = !encendido(); guardar(on); pintar(); if (on) sonidoStart(); });
  pintar();

  document.addEventListener('click', e => {
    if (!encendido()) return;
    const el = (e.target as HTMLElement).closest('.btn--start');
    if (el) sonidoStart();
  });
  document.addEventListener('llavecorp:powerup', () => { if (encendido()) sonidoPowerUp(); });
  document.addEventListener('llavecorp:easter', () => { if (encendido()) sonidoPowerUp(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
