// Progreso de tutoriales en /activa: guarda los usos logrados en localStorage y llena corazones.
// Si localStorage no existe o falla, la página funciona igual, solo sin progreso.
const CLAVE = 'llavecorp-logros';

export function leerLogrados(): string[] {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(lista) ? lista.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function marcarLogrado(slug: string): string[] {
  const lista = Array.from(new Set([...leerLogrados(), slug]));
  try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch { /* sin almacenamiento */ }
  return lista;
}

export function pintarCorazones(logrados: string[]): void {
  document.querySelectorAll<HTMLElement>('.corazones').forEach(barra => {
    const corazones = barra.querySelectorAll<HTMLElement>('.corazon');
    corazones.forEach((c, i) => c.classList.toggle('corazon--lleno', i < logrados.length));
    barra.setAttribute('aria-label', `Progreso: ${Math.min(logrados.length, corazones.length)} de ${corazones.length} tutoriales completados`);
  });
  document.querySelectorAll<HTMLElement>('[data-uso]').forEach(el => {
    el.classList.toggle('uso--logrado', logrados.includes(el.dataset.uso ?? ''));
  });
}

function iniciar() {
  pintarCorazones(leerLogrados());
  const boton = document.querySelector<HTMLButtonElement>('[data-logro]');
  const caja = document.getElementById('powerup');
  if (!boton) return;
  boton.addEventListener('click', () => {
    const slug = boton.dataset.logro ?? '';
    const lista = marcarLogrado(slug);
    pintarCorazones(lista);
    if (caja) {
      caja.hidden = false;
      caja.classList.remove('powerup');
      void caja.offsetWidth; // reinicia la animación si ya se mostró
      caja.classList.add('powerup');
    }
    boton.textContent = '¡Guardado!';
    boton.setAttribute('aria-pressed', 'true');
    document.dispatchEvent(new CustomEvent('llavecorp:powerup', { detail: { slug } }));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
