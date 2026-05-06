export type StatutRDV = 'CONFIRME' | 'ANNULE' | 'EFFECTUE' | 'MANQUE' | 'EN_ATTENTE';

export interface RendezVous {
  id: number;
  dateHeure: string;
  dureeEstimee: number | null;
  adresse: string | null;
  statut: StatutRDV;
  creneauDisponible: string | null;
  notes: string | null;
  donneur?: { id: number } | null;
  centreDon?: { id: number; nom?: string } | null;
}

export interface RendezVousCreatePayload {
  dateHeure: string;
  adresse?: string;
  notes?: string;
  statut?: StatutRDV;
  donneur: { id: number };
  centreDon: { id: number };
}
