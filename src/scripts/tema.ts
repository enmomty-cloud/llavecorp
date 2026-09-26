// Modo noche arcade: sigue la preferencia del sistema hasta que el visitante elija; la elección se guarda.
const CLAVE = 'llavecorp-tema';
type Tema = 'claro' | 'noche';

export function temaActual(): Tema {
  const forzado = document.documentElement.dataset.tema;
  if (forzado === 'claro' || forzado === 'noche') return forzado;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'noche' : 'claro';
}

export function fijarTema(t: Tema): void {
  document.documentElement.dataset.tema = t;
  try { localStorage.setItem(CLAVE, t); } catch { /* sin almacenamiento */ }
}

function iniciar() {
  const boton = document.querySelector<HTMLButtonElement>('[data-toggle-tema]');
  if (!boton) return;
  const pintar = () => {
    const noche = temaActual() === 'noche';
    boton.textContent = noche ? 'Modo día' : 'Noche arcade';
    boton.setAttribute('aria-pressed', String(noche));
  };
  boton.addEventListener('click', () => { fijarTema(temaActual() === 'noche' ? 'claro' : 'noche'); pintar(); });
  pintar();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
