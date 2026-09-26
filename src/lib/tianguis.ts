import tianguisJson from '../data/tianguis.json';
import mayoreoJson from '../data/mayoreo.json';

export type Puesto = { dia: string; lugar: string; zona: string; horario: string; activo: boolean; nota: string };
export type RangoMayoreo = { desde: number; hasta: number | null; precio_basico: number; precio_nfc: number; nota: string };

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** 0 = lunes … 6 = domingo; -1 si el día no se reconoce. */
export const ordenDia = (dia: string) => DIAS.indexOf(sinAcentos(dia));

export function getTianguisActivos(): Puesto[] {
  return (tianguisJson as Puesto[]).filter(p => p.activo).sort((a, b) => ordenDia(a.dia) - ordenDia(b.dia));
}

export const getMayoreo = () => mayoreoJson as RangoMayoreo[];
