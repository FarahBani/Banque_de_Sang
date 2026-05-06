export type GroupeSanguin =
  | 'A_PLUS' | 'A_MOINS' | 'B_PLUS' | 'B_MOINS'
  | 'AB_PLUS' | 'AB_MOINS' | 'O_PLUS' | 'O_MOINS';

export type TypeBadge = 'BRONZE' | 'ARGENT' | 'OR' | 'PLATINE';

export interface DonLite {
  id: number;
  dateDon: string;
  quantite: number;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'EFFECTUE';
  lieu?: string | null;
  commentaire?: string | null;
}

export interface RendezVousLite {
  id: number;
  dateHeure: string;
  statut: 'CONFIRME' | 'ANNULE' | 'EFFECTUE' | 'MANQUE' | 'EN_ATTENTE';
}

export interface Donneur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  dateInscription: string | null;
  actif: boolean;
  groupeSanguin: GroupeSanguin | null;
  dateNaissance: string | null;
  poids: number | null;
  adresse: string | null;
  badge: TypeBadge | null;
  grade: string | null;
  eligible: boolean;
  dons?: DonLite[];
  rendezVous?: RendezVousLite[];
}

export interface DonneurCreatePayload {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  groupeSanguin?: GroupeSanguin;
  dateNaissance?: string;
  poids?: number;
  adresse?: string;
}