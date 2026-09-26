// Easter eggs: código Konami, cinco toques a la mascota y escribir "vhs". Nada de esto corre con prefers-reduced-motion.
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function lluviaCorazones(cantidad = 30): void {
  if (reducido()) return;
  for (let i = 0; i < cantidad; i++) {
    const s = document.createElement('span');
    s.className = 'corazon-cae';
    s.textContent = '♥';
    s.style.left = `${Math.random() * 100}vw`;
    s.style.animationDelay = `${Math.random() * 1.2}s`;
    s.style.color = ['var(--magenta)', 'var(--cian)', 'var(--amarillo)'][i % 3];
    s.setAttribute('aria-hidden', 'true');
    s.addEventListener('animationend', () => s.remove());
    document.body.appendChild(s);
  }
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
    if (teclas.join() === KONAMI.join()) { teclas = []; lluviaCorazones(); }
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
    if (toques.length >= 5) { toques = []; lluviaCorazones(); }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
