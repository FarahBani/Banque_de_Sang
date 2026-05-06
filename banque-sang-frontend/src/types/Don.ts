export type StatutDon = 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'EFFECTUE';

export interface Don {
  id: number;
  dateDon: string;
  quantite: number;
  statut: StatutDon;
  lieu: string | null;
  commentaire: string | null;
  donneur?: { id: number } | null;
}

export interface DonCreatePayload {
  dateDon: string;
  quantite: number;
  lieu?: string;
  commentaire?: string;
  donneur: { id: number };
}
