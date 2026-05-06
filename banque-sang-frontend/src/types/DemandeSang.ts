export interface DemandeSang {
  id: number;
  groupeSanguin: string;
  quantiteDemandee: number;
  priorite: 'haute' | 'normale' | 'basse';
  dateDemande: string;
  dateRequise: string;
  statut: 'urgent' | 'pending' | 'approved' | 'delivered';
  description: string;
  medecinHopital?: {
    id: number;
    nom: string;
    hopital?: {
      id: number;
      nom: string;
    };
  };
}