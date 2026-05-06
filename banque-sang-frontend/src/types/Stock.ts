import type { GroupeSanguin } from './Donneur';

export interface Stock {
  id: number;
  groupeSanguin: GroupeSanguin;
  quantiteDisponible: number;
  seuilMinimum: number | null;
  estCritique: number | null;
  localisation: string | null;
}

export type NiveauStock = 'CRITIQUE' | 'FAIBLE' | 'OK';

export const calculerNiveau = (stock: Stock): NiveauStock => {
  const seuil = stock.seuilMinimum ?? 10;
  if (stock.quantiteDisponible <= seuil / 2) return 'CRITIQUE';
  if (stock.quantiteDisponible <= seuil) return 'FAIBLE';
  return 'OK';
};
